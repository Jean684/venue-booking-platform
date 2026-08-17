import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entity/Venue";
import { Between, Like, MoreThanOrEqual } from "typeorm";

// If we were to update multiple things, then split it up into multiple controllers
// Ex: update application --> ApplicationController, update profile --> ProfileController

// For controller - should not return full user as a response
// Only return error message


export class VenueController {
  private venueRepository = AppDataSource.getRepository(Venue);

  /*
   * 1. Find all venues in the database
   */ 
  async all(request: Request, response: Response) {
    const venues = await this.venueRepository.find();
    return response.json(venues);
  }

  // Search for venues 
  async searchVenue(request: Request, response: Response) {
    const q = request.query.q as string;

    // If there is no search - return all venues
    if (!q || q.trim().toLowerCase() === "") {
      const all = await this.venueRepository.find()
      return response.json(all)
    }

    const isNumber = !isNaN(Number(q));
    const num = Number(q);    

    const where: any[] = [
      { heading: Like(`%${q}%`) },
      { description: Like(`%${q}%`) },
      { location: Like(`%${q}%`) },
      { keywords: Like(`%${q}%`) },
    ];

    if (isNumber) {
      where.push(
        { guests: num },
        { price: num }
      );
    }
    const venue = await this.venueRepository.find({
      where,
    });

    return response.json(venue);
  }  

  /*
   * 2. Find a single venue in the database
   */  
  async one(request: Request, response: Response) {
    const venueId = request.params.venueId;
    const venue = await this.venueRepository.findOne({
      where: { venueId },
    });

    if (!venue) {
      return response.status(404).json({ message: "Venue not found" });
    }
    return response.json(venue);
  }

  // Find all venues belonging to a single vendor
  async getVenuesByVendor(request: Request, response: Response) {
    //const id = request.params.id;
    const vendorId = request.params.vendorId;
  
    const venues = await this.venueRepository.find({
      where: { vendorId },
    });
  
    if (!venues) {
      return response.status(500).json({ message: "Error retrieving venues" });
    }
    return response.json(venues)
  }


  /*
   * 3. Creates a new venue in the database
   */
  async save(request: Request, response: Response) {
    const vendorId = request.params.vendorId;
    const { heading, imgUrl, guests, location, price, description, keywords } = request.body;

    const venue = Object.assign(new Venue(), {
      vendorId,
      heading,
      imgUrl,
      guests,
      location,
      price,
      description,
      keywords
    });

    try {
      const savedVenue = await this.venueRepository.save(venue);
      return response.status(201).json(savedVenue);
    } catch (error) {
        // Debug here - dont put in .json return
      console.log(error)
      return response
        .status(400)
        .json({ message: "Error creating venue" });
    }
  }

  /**
   * 4. Deletes a venue only if it belongs to the vendor making the request
   * @param request - Express request object containing venue ID in params and vendor ID in body
   * @param response - Express response object
   * @returns JSON response containing success message or error message
   */
  async remove(request: Request, response: Response) {

    // request.params.venueId has to match user.routes 
    // i.e if route has /venues/:venueId 
    // this becomes request.params.venueId
    const venueId = request.params.venueId;
    const vendorId = request.params.vendorId;

    const venueToRemove = await this.venueRepository.findOne({
      where: { venueId, vendorId },
    });

    if (!venueToRemove) {
      return response.status(404).json({ message: "Venue not found or does not belong to the specified vendor" });
    }

    await this.venueRepository.remove(venueToRemove);
    return response.json({ message: "Venue removed successfully" });
  }

  /**
   * 5. Updates an existing venue's information
   * @param request - Express request object containing venue ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated venue or error message
   */
  async update(request: Request, response: Response) {
    const vendorId = request.params.vendorId;
    const venueId = request.params.venueId;
    //const { firstName, lastName, email, age } = request.body;

    // let venueToUpdate = await this.venueRepository.findOne({
    //   where: { venueId },
    // });

    const venueToUpdate = await this.venueRepository.findOne({
      where: { venueId, vendorId },
    });

    if (!venueToUpdate) {
      return response.status(404).json({ message: "Venue not found or does not belong to the specified vendor" });
    }

    // venueToUpdate = Object.assign(venueToUpdate, {
    //   firstName,
    //   lastName,
    //   email,
    //   age,
    // });

    Object.assign(venueToUpdate, request.body);

    try {
      const updatedVenue = await this.venueRepository.save(venueToUpdate);
      return response.json(updatedVenue);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating venue", error });
    }
  }
}
