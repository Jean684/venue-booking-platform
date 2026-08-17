import gql from "graphql-tag";
import { Venue } from "../entity/Venue";

export const typeDefs = gql`

  type User {
    id: ID!
    role: String!
    email: String!
    name: String
    phone: String
    dateJoined: String!
    documents: String
    ratingAverage: Float!
    ratingCount: Int!
  }
  
  type Venue {
    venueId: ID!
    vendorId: ID!
    heading: String!
    imgUrl: String!
    guests: Int!
    location: String!
    price: Int!
    description: String!
    keywords: String
    featured: Boolean!
    vendor: User!
  }

  type LoginResponse {
    message: String!
    user: User!
  }

  # Define template with input objects
  # --- Creating --- 
  input CreateVenueInput {
    vendorId: ID!
    heading: String!
    location: String!
    description: String!
    imgUrl: String!
    guests: Int!
    price: Float!
    keywords: String
  }

  # --- Update --- 
  input UpdateVenueInput {
    heading: String
    location: String
    description: String
    imgUrl: String
    guests: Int
    price: Float
    keywords: String
  }  
  
  type Query {
    venues: [Venue!]!
    venue(venueId: ID!): Venue

    users: [User!]!
    user(id: ID!): User

    Venue(vendorId: ID!): [Venue!]
    TestContext: String!
  }

  type Mutation {
    createVenue(input: CreateVenueInput!): Venue!
    updateVenue(venueId: ID!, input: UpdateVenueInput!): Venue!
    deleteVenue(venueId: ID!): Boolean!

    login(
      email: String!, 
      password: String!
    ): LoginResponse

    featuredVenue(venueId: ID!, featured: Boolean!): Venue!

    assignVendorToVenue(
      venueId: ID!,
      vendorId: ID!
    ): Venue!
  }
`;