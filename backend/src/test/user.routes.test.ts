import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

describe("User REST API", () => {
  /**
   * Context: a new hirer wants to create an account before applying for venues.
   * The backend should save the account, hash the password, and avoid returning
   * the password in the API response.
   */
  test("POST /api/users creates a hirer account securely", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        name: "Test Hirer",
        email: "test.hirer@example.com",
        role: "hirer",
        password: "Secure@123",
        phone: "0412345678",
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("test.hirer@example.com");
    expect(response.body.role).toBe("hirer");
    expect(response.body.password).toBeUndefined();

    const savedUser = await AppDataSource.getRepository(User).findOneBy({
      email: "test.hirer@example.com",
    });

    expect(savedUser).not.toBeNull();
    expect(savedUser?.password).not.toBe("Secure@123");

    const passwordMatches = await bcrypt.compare(
      "Secure@123",
      savedUser!.password
    );

    expect(passwordMatches).toBe(true);
  });

  /**
   * Context: an existing vendor opens their profile page.
   * The backend should retrieve the requested user while keeping the hashed
   * password hidden from the response.
   */
  test("GET /api/users/:id retrieves a user without exposing password", async () => {
    const repository = AppDataSource.getRepository(User);

    const savedUser = await repository.save(
      Object.assign(new User(), {
        name: "Test Vendor",
        email: "test.vendor@example.com",
        role: "vendor",
        password: await bcrypt.hash("Secure@123", 10),
        phone: "0498765432",
        ratingAverage: 0,
        ratingCount: 0,
      })
    );

    const response = await request(app).get(`/api/users/${savedUser.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(savedUser.id);
    expect(response.body.email).toBe("test.vendor@example.com");
    expect(response.body.password).toBeUndefined();
  });

  /**
   * Context: a hirer edits their profile after changing their phone number.
   * The backend should update the allowed profile fields and return the new
   * values without exposing the stored password.
   */
  test("PUT /api/users/:id updates a user's profile details", async () => {
    const repository = AppDataSource.getRepository(User);

    const savedUser = await repository.save(
      Object.assign(new User(), {
        name: "Old Name",
        email: "profile.user@example.com",
        role: "hirer",
        password: await bcrypt.hash("Secure@123", 10),
        phone: "0400000000",
        ratingAverage: 0,
        ratingCount: 0,
      })
    );

    const response = await request(app)
      .put(`/api/users/${savedUser.id}`)
      .send({
        name: "Updated Name",
        phone: "0411111111",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Name");
    expect(response.body.phone).toBe("0411111111");
    expect(response.body.password).toBeUndefined();

    const updatedUser = await repository.findOneBy({
      id: savedUser.id,
    });

    expect(updatedUser?.name).toBe("Updated Name");
    expect(updatedUser?.phone).toBe("0411111111");
  });

  /**
   * Context: a user chooses to remove their Venue Vendors account.
   * The backend should delete the matching user and confirm that the account
   * no longer exists in the database.
   */
  test("DELETE /api/users/:id removes an existing user", async () => {
    const repository = AppDataSource.getRepository(User);

    const savedUser = await repository.save(
      Object.assign(new User(), {
        name: "Delete Me",
        email: "delete.user@example.com",
        role: "hirer",
        password: await bcrypt.hash("Secure@123", 10),
        phone: "0422222222",
        ratingAverage: 0,
        ratingCount: 0,
      })
    );

    const response = await request(app).delete(
      `/api/users/${savedUser.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "User removed successfully"
    );

    const deletedUser = await repository.findOneBy({
      id: savedUser.id,
    });

    expect(deletedUser).toBeNull();
  });
});