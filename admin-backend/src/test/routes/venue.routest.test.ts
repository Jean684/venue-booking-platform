// Lecture Week 9 - Example 3
import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { AppDataSource } from "../../data-source";
import { Venue } from "../../entity/Venue";
import { getApp } from "../test-app"
import { error } from "node:console";
import { query } from "express";

describe("Venue Routes", () => {
  beforeEach(async () => {
    // Clear the venues table before each test
    const venueRepository = AppDataSource.getRepository(Venue);
    await venueRepository.clear();
  });

  describe("GET /api/venue", () => {
    it("should return an empty array when no venues exist", async () => {
        const query = `
          query {
            venues {
              venueId
              heading
            }
          }
        `;

      const response = await request(getApp()).post("/graphql").send({ query });
      console.log(error)
      expect(response.status).toBe(200);
      expect(response.body.data.venues).toEqual([]);
    });

    it("should return all venues when venues exist", async () => {
      // Create a test venue
      const venueRepository = AppDataSource.getRepository(Venue);
      const venue = new Venue();
      venue.heading = "Test Venue";
      venue.vendorId= ""
      await venueRepository.save(venue);

      const query = `
        query {
          venues {
            vendorId
            venueId
            heading
          }
        }
      `;

      const response = await request(getApp()).post("/graphql").send({ query });
      console.log(error)
      expect(response.status).toBe(200);
      expect(response.body.data.venues).toHaveLength(1);
      expect(response.body.data.venues[0].heading).toBe("Test Venue");
    });
  });



  describe("POST /api/venue", () => {
    it("should create a new venue", async () => {
      const mutation = `
        mutation {
          createVenue(input: {
            heading: "New Venue",
            location: "Melbourne CBD",
            description: "None",
            imgUrl: "None",
            guests: 10,
            price: 100,
            vendorId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
          }) {
            venueId
            vendorId
            heading
            location
            description
            imgUrl
            guests
            price
          }
        }
      `;

      const response = await request(getApp()).post("/graphql").send({ query: mutation });
      console.log(error)
      console.log(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.createVenue.heading).toBe("New Venue");
      expect(response.body.data.createVenue.location).toBe("Melbourne CBD");
      expect(response.body.data.createVenue.description).toBe("None");
      expect(response.body.data.createVenue.imgUrl).toBe("None");
      expect(response.body.data.createVenue.guests).toBe(10);
      expect(response.body.data.createVenue.price).toEqual(100);      
    });

    it("should return 400 when required fields are missing", async () => {
      const mutation = `
        mutation {
          createVenue(input: {
            heading: ""
            vendorId: ""
          }) {
            venueId
            heading
          }
        }
      `;
      // missing location, guests, price, imgUrl, keywords, description, vendorId etc


      const response = await request(getApp()).post("/graphql").send({ query: mutation });
      console.log(error)
      console.log(response.body)
      expect(response.body.errors).toBeDefined();
  });
  
})});
