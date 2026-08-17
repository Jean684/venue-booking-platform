import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";
import { User } from "../entity/User";
import { Venue } from "../entity/Venue";

// If we were to update multiple things, then split it up into multiple controllers
// Ex: update application --> ApplicationController, update profile --> ProfileController

// For controller - should not return full user as a response
// Only return error message


export class ApplicationController {
  private appRepository = AppDataSource.getRepository(Application);
  private userRepository = AppDataSource.getRepository(User);
  private venueRepository = AppDataSource.getRepository(Venue);

  /*
   * 1. Find all applications in the database based on userId
   */ 
  async all(request: Request, response: Response) {
    const applications = await this.appRepository.find({
      relations: ["user", "venue"]
    });

    return response.json(applications);
  }

  /*
   * 2. Find a single application in the database
   */  
  async one(request: Request, response: Response) {
    const applicationId = request.params.applicationId;
    const application = await this.appRepository.findOne({
      where: { applicationId },
      relations: ["user", "venue"],
    });

    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }
    return response.json(application);
  }

  // P/S id here means userId
  async findByUser(request: Request, response: Response) {
    const id = request.params.id;
    const applications = await this.appRepository.find({
      where: { user: { id: id } },
      relations: ["user", "venue"],
    });
    return response.json(applications);
  }

  async getApplicationsByVenue(req: Request, res: Response) {
    const venueId = req.params.venueId;
    const applications = await this.appRepository.find({
      where: { venue: { venueId: venueId } },
      relations: ["user", "venue"]
    });

    return res.json(applications);
  };

  /*
   * 3. Creates a new application in the database
   */
  async save(request: Request, response: Response) {
    const { eventName, guestCount, startDate, endDate, status, userId, venueId } = request.body;

    if (!userId || !venueId) { 
      return response.status(400).json({message: "userId and venueId are required"});
    }

    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Find the venue
    const venue = await this.venueRepository.findOne({
      where: { venueId: venueId },
    });

    if (!venue) {
      return response.status(404).json({ message: "Venue not found" });
    }

    const application = Object.assign(new Application(), {
      eventName,
      guestCount,
      startDate,
      endDate,
      status,
      user,
      venue
    });

    try {
      const savedApplication = await this.appRepository.save(application);
      return response.status(201).json(savedApplication);
    } catch (error) {
        // Debug here - dont put in .json return
      console.log(error)
      return response
        .status(400)
        .json({ message: "Error creating user" });
    }
  }

  /**
   * 4. Deletes a user from the database by their ID
   */
  async remove(request: Request, response: Response) {

    // request.params.applicationId has to match user.routes 
    // i.e if route has /appl/:applicationId 
    // this becomes request.params.applicationId
    const applicationId = request.params.applicationId;
    const applicationToRemove = await this.appRepository.findOne({
      where: { applicationId },
    });

    if (!applicationToRemove) {
      return response.status(404).json({ message: "Application not found" });
    }

    await this.appRepository.remove(applicationToRemove);
    return response.json({ message: "Application removed successfully" });
  }

  /**
   * 5. Updates an existing user's information
   * @param request - Express request object containing user ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated user or error message
   */
  async update(request: Request, response: Response) {
    try {
      const applicationId = request.params.applicationId;
      const { status, comment, rating } = request.body;

      const applicationToUpdate = await this.appRepository.findOne({
        where: { applicationId },
        relations: ["user", "venue"],
      });

      if (!applicationToUpdate) {
        return response
          .status(404)
          .json({ message: "Application not found" });
      }

      if (status !== undefined) {
        applicationToUpdate.status = status;
      }

      if (comment !== undefined) {
        applicationToUpdate.comment = comment;
      }

      if (rating !== undefined) {
        const numericRating = Number(rating);

        if (applicationToUpdate.status !== "Accepted") {
          return response.status(400).json({
            message: "Only accepted applications can be rated",
          });
        }

        if (applicationToUpdate.rated) {
          return response.status(409).json({
            message: "This application has already been rated",
          });
        }

        if (
          !Number.isFinite(numericRating) ||
          numericRating < 0 ||
          numericRating > 5
        ) {
          return response.status(400).json({
            message: "Rating must be a number between 0 and 5",
          });
        }

        const hirer = await applicationToUpdate.user;

        if (!hirer) {
          return response.status(404).json({
            message: "Hirer not found",
          });
        }

        const oldAverage = Number(hirer.ratingAverage ?? 0);
        const oldCount = Number(hirer.ratingCount ?? 0);

        const newCount = oldCount + 1;
        const newAverage =
          (oldAverage * oldCount + numericRating) / newCount;

        hirer.ratingAverage = Number(newAverage.toFixed(2));
        hirer.ratingCount = newCount;

        applicationToUpdate.rating = numericRating;
        applicationToUpdate.rated = true;

        await this.userRepository.save(hirer);
      }

      const updatedApplication =
        await this.appRepository.save(applicationToUpdate);

      return response.json(updatedApplication);
    } catch (error) {
      console.error("Error updating application:", error);

      return response.status(500).json({
        message: "Error updating application",
      });
    }
  }
}
