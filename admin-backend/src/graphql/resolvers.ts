import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Venue } from "../entity/Venue";
import { CreateVenueInput } from "../types/types";
import * as bcrypt from "bcrypt";


const userRepository = AppDataSource.getRepository(User);
const venueRepository = AppDataSource.getRepository(Venue);

// profile = venues, pet = user
export const resolvers = {
  Query: {
    venues: async () => {
      return await venueRepository.find();
    },
    venue: async (_: any, { venueId }: { venueId: string }) => {
      const venue = await venueRepository.findOne({ where: { venueId: venueId },});
      if (!venue) throw new Error("Venue not found");
      return venue;
    },
    users: async () => {
      return await userRepository.find();
    },
    user: async (_: any, { id }: { id: string }) => {
      const user = await userRepository.findOne({ where: { id: id } });
      if (!user) throw new Error("User not found");
      return user;
    },
    TestContext: (_: any, __: any, context: any) => {
      return JSON.stringify(context.user);
      // console.log(context);
      // return "Context received";
    }

  },
  Mutation: {
    login: async (_: unknown, args: { email: string; password: string; }) => {
      const { email, password } = args;
      const user = await userRepository.findOne({where: { email }});

      if (!user) { throw new Error("User not found");}

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) { throw new Error("Invalid password"); }

      const { password: userPassword, ...userWithoutPassword } = user;
      return {
        message: "Sign in successful",
        user: userWithoutPassword,
      };
    },

    createVenue: async (_: any, {input}: {input: CreateVenueInput}) => {
      const venue = venueRepository.create(input);
      return await venueRepository.save(venue);
    },
    
    updateVenue: async (
      _: any, 
      { venueId, input }: { venueId: string; input: Partial<Venue>} 
    ) => {
      // await venueRepository.update(venueId, input);
      const venueToUpdate = await venueRepository.findOne({
        where: { venueId: venueId },
      });

      if (!venueToUpdate) { throw new Error("Venue not found or does not belong to this vendor");}
      Object.assign(venueToUpdate, input);

      try {
        return await venueRepository.save(venueToUpdate);
      } catch (error) {
        throw new Error("Error updating venue");
      }
    },

    deleteVenue: async (_: any, { venueId }: { venueId: string }) => {
      const result = await venueRepository.delete(venueId);
      return result.affected !== 0;
    },

    featuredVenue: async (_: any, { venueId, featured }: { venueId: string; featured: boolean }) => {
      const venueRepository = AppDataSource.getRepository(Venue);
    
      const venue = await venueRepository.findOneBy({ venueId });
      if (!venue) throw new Error("Venue not found");
    
      // Debug
      console.log("before:", venue.featured);
      venue.featured = featured;   
      console.log("after:", venue.featured);
    
      return await venueRepository.save(venue);
    },

    assignVendorToVenue: async (_: any, 
      { venueId, vendorId }: {
        venueId: string;
        vendorId: string;
      }) => {
      const venue = await venueRepository.findOne({
        where: { venueId: venueId },
      });
    
      if (!venue) {
        throw new Error("Venue not found");
      }
    
      const vendor = await userRepository.findOne({
        where: {
          id: vendorId,
          role: "vendor",
        },
      });
    
      if (!vendor) {
        throw new Error("Vendor not found");
      }
    
      venue.vendorId = vendorId;
    
      return await venueRepository.save(venue);
    }    
  },

  // Type Resolver that connect related data together
  // Essentially, Venue is the parent object we look into
  // Inside, we only return the user when its id match Venue/Parent.vendorId
  // We do this because setting a relation between User and Venue can be problematic
  // E.g not all User have Venues b/c might be Hirer
  // https://www.youtube.com/watch?v=2oy0Uw5jUxc&list=PL4cUxeGkcC9gUxtblNUahcsg0WLxmrK_y&index=7
  Venue: {
    vendor: async (parent: any, _: any) => {
      return userRepository.findOne({
        where: { id: parent.vendorId },
      });
    },
  },
};
