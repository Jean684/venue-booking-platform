import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Blockdate } from "../entity/Blockdate";
import { Venue } from "../entity/Venue";


// If we were to update multiple things, then split it up into multiple controllers
// Ex: update application --> ApplicationController, update profile --> ProfileController

// For controller - should not return full user as a response
// Only return error message


export class BlockdateController {
  private blockdateRepository = AppDataSource.getRepository(Blockdate);
  private venueRepository = AppDataSource.getRepository(Venue);

  /*
   * 1. Find all blockdates in the database
   */ 
  async all(request: Request, response: Response) {
    const blockdates = await this.blockdateRepository.find();

    return response.json(blockdates);
  }

  /*
   * 2. Find a single blockdate in the database
   */  
  async one(request: Request, response: Response) {
    const blockdateId = request.params.blockdateId;
    const blockdate = await this.blockdateRepository.findOne({
      where: { blockdateId },
    });

    if (!blockdate) {
      return response.status(404).json({ message: "Block dates not found" });
    }
    return response.json(blockdate);
  }


  // Find all blockdates belonging to a single venue
  async getBlockdatesByVenue(request: Request, response: Response) {
    const venueId = request.params.venueId;

    const blockdates = await this.blockdateRepository.find({
      where: { venue: { venueId: venueId } },
      relations: ["venue"],
    });

    return response.json(blockdates);
  }

  async getBlockdatesByVendor(request: Request, response: Response) {
    const vendorId = request.params.vendorId;

    const blockdates = await this.blockdateRepository.find({
      where: { venue: { vendorId: vendorId } },
      relations: ["venue"],
    });

    return response.json(blockdates);
  }


  /*
   * 3. Creates a new blockdate in the database
   */
  async save(request: Request, response: Response) {
    const { startDate, endDate, venueId } = request.body;

    // Check 1 - Find the venue
    const venue = await this.venueRepository.findOne({
      where: { venueId: venueId },
    });

    if (!venue) {
      return response.status(404).json({ message: "Venue not found" });
    }
    
    // Check 2 - Find all blockdates - compared if they are overlapped
    const existingBlockdates = await this.blockdateRepository.find({
      where: { venue: { venueId } },
    });

    const isOverlap = existingBlockdates.some(bd => {
      return (
        new Date(startDate) <= new Date(bd.endDate) &&
        new Date(endDate) >= new Date(bd.startDate)
      );
    });

    if (isOverlap) {
      return response.status(409).json({message: "Block date overlaps with existing blocked range"});
    }

    const blockdate = Object.assign(new Blockdate(), {
      startDate,
      endDate,
      venue,
    });

    try {
      const savedBlockdate = await this.blockdateRepository.save(blockdate);
      return response.status(201).json(savedBlockdate);
    } catch (error) {
        // Debug here - dont put in .json return
      console.log(error)
      return response
        .status(400)
        .json({ message: "Error creating block dates" });
    }
  }

  /**
   * 4. Deletes a user from the database by their ID
   */
  async remove(request: Request, response: Response) {

    // request.params.blockdateId has to match user.routes 
    // i.e if route has /blockdates/:blockdateId 
    // this becomes request.params.blockdateId
    const blockdateId = request.params.blockdateId;
    const blockdateToRemove = await this.blockdateRepository.findOne({
      where: { blockdateId },
    });

    if (!blockdateToRemove) {
      return response.status(404).json({ message: "Block dates not found" });
    }

    await this.blockdateRepository.remove(blockdateToRemove);
    return response.json({ message: "Block dates removed successfully" });
  }
}
