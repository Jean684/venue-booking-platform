import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

import * as bcrypt from "bcrypt";

// If we were to update multiple things, then split it up into multiple controllers
// Ex: update application --> ApplicationController, update profile --> ProfileController

// For controller - should not return full user as a response
// Only return error message

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const users = await this.userRepository.find();

    const usersWithoutPasswords = users.map(({ password, ...user }) => user); // Exclude passwords from response

    return response.json(usersWithoutPasswords);
  }

  /**
   * Retrieves a single user by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const id = request.params.id;
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    return response.json(userWithoutPassword);
  }

  /**
   * Creates a new user in the database
   * @param request - Express request object containing user details in body
   * @param response - Express response object
   * @returns JSON response containing the created user or error message
   */
  async save(request: Request, response: Response) {
    const { name, email, password, role, phone } = request.body;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return response
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = Object.assign(new User(), {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      ratingAverage: 0,
      ratingCount: 0,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = savedUser; // Exclude password from response

      return response.status(201).json(userWithoutPassword);

    } catch (error) {
        // Debug here - dont put in .json return
      console.log(error)
      return response
        .status(400)
        .json({ message: "Error creating user" });
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ message: "Invalid password" });
    }

    const { password: userPassword, ...userWithoutPassword } = user; // Exclude password from response

    return response.json({
      message: "Sign in successful",
      user: userWithoutPassword,
    });
  }

  /**
   * Deletes a user from the database by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if user not found
   */
  async remove(request: Request, response: Response) {

    // request.params.id has to match user.routes 
    // i.e if route has /users/:userId 
    // this becomes request.params.id
    const id = request.params.id;
    const userToRemove = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToRemove) {
      return response.status(404).json({ message: "User not found" });
    }

    await this.userRepository.remove(userToRemove);
    return response.json({ message: "User removed successfully" });
  }

  /**
   * Updates an existing user's information
   * @param request - Express request object containing user ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated user or error message
   */
  async update(request: Request, response: Response) {
    const id = request.params.id;
    const { name, phone } = request.body;

    let userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    userToUpdate = Object.assign(userToUpdate, {
      name,
      phone
    });

    try {
      const updatedUser = await this.userRepository.save(userToUpdate);
      const { password, ...userWithoutPassword } = updatedUser;
      return response.json(userWithoutPassword);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating user", error });
    }
  }

  async updateDocuments(request: Request, response: Response) {
    const id = request.params.id;
    const { documents } = request.body;

    let userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    userToUpdate = Object.assign(userToUpdate, {
      documents
    });

    try {
      const updatedUser = await this.userRepository.save(userToUpdate);
      return response.json(updatedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating user", error });
    }
  }
}
