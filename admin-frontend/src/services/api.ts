import { gql } from "@apollo/client";
import { client } from "./apollo-client";
import { Venue, User, CreateVenueInput, UpdateVenueInput } from "../types/types";
import { AssignVendorToVenueMutation, AssignVendorToVenueMutationVariables, CreateVenueMutation, CreateVenueMutationVariables, DeleteVenueMutation, DeleteVenueMutationVariables, FeatureVenueMutation, FeatureVenueMutationVariables, GetUserQuery, GetUsersQuery, GetVenueQuery, GetVenuesQuery, LoginMutation, LoginMutationVariables, UpdateVenueMutation, UpdateVenueMutationVariables } from "../types/__generated__/graphql";

// GraphQL Queries
const GET_VENUES = gql`
  query GetVenues {
    venues {
      description
      guests
      heading
      imgUrl
      keywords
      location
      price
      vendorId
      venueId
      featured
    }
  }
`;

const GET_VENUE = gql`
  query GetVenue($venueId: ID!) {
    venue(venueId: $venueId) {
      description
      guests
      heading
      imgUrl
      keywords
      location
      price
      vendorId
      venueId
      featured
      vendor {
        id
        name
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      phone
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      phone
    }
  }
`;

// GraphQL Mutations
const CREATE_VENUE = gql`
  # Debug 
  mutation CreateVenue($input: CreateVenueInput!) {
    # Define input
    createVenue(input: $input) {
      # Responses return
      venueId
      vendorId
      heading
      location
      description
      imgUrl
      guests
      price
      keywords
    }
  }
`;

const UPDATE_VENUE = gql`
  mutation UpdateVenue(
    $venueId: ID!
    $input: UpdateVenueInput!
  ) {
    updateVenue(
      venueId: $venueId
      input: $input
    ) {
      venueId
      vendorId
      heading
      location
      description
      imgUrl
      guests
      price
      keywords
    }
  }
`;

const DELETE_VENUE = gql`
  mutation DeleteVenue($venueId: ID!) {
    deleteVenue(venueId: $venueId)
  }
`;

const LOG_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      user {
        id
        email
        role
        name
      }
    }
  }
`;

const ASSIGN_VENDOR = gql`
  mutation AssignVendorToVenue($venueId: ID!, $vendorId: ID!) {
    assignVendorToVenue(venueId: $venueId, vendorId: $vendorId) {
      vendor {
        id
        name
      }
      vendorId
      venueId
    }
  }
`

const FEATURE_VENUE = gql`
  mutation FeatureVenue($venueId: ID!, $featured: Boolean!) {
    featuredVenue(venueId: $venueId, featured: $featured) {
      featured
      venueId
      heading
    }
  }
`

export const venueService = {
  getAllVenues: async (): Promise<Venue[]> => {
    const { data } = await client.query<GetVenuesQuery>({ query: GET_VENUES });
    return data?.venues ?? [];
  },

  getVenue: async (venueId: string): Promise<Venue | null> => {
    const { data } = await client.query<GetVenueQuery>({
      query: GET_VENUE,
      variables: { venueId },
    });

    if (!data?.venue) {
      throw new Error("Venue not found");
    }

    return data.venue;
  },

  createVenue: async (venue: CreateVenueInput): Promise<Venue> => {
    const { data } = await client.mutate<CreateVenueMutation, CreateVenueMutationVariables>({
      mutation: CREATE_VENUE,
      variables: { input: venue },
    });

    if (!data?.createVenue) {
      throw new Error("Failed to create venue");
    }
    return data.createVenue;
  },

  deleteVenue: async (venueId: string): Promise<boolean> => {
    const { data } = await client.mutate<
      DeleteVenueMutation, 
      DeleteVenueMutationVariables>
    ({
      mutation: DELETE_VENUE,
      variables: { venueId },
    });

    if (!data?.deleteVenue) {
      throw new Error("Failed to delete venue");
    }

    return data.deleteVenue;
  },

  updateVenue: async (
    venueId: string,
    updatedVenue: UpdateVenueInput
  ): Promise<Venue> => {
    const { data } = await client.mutate<
      UpdateVenueMutation,
      UpdateVenueMutationVariables
    >({
      mutation: UPDATE_VENUE,
      variables: { venueId, input: updatedVenue },
    });

    if (!data?.updateVenue) {
      throw new Error("Failed to update venue");
    }

    return data.updateVenue;
  },

  assignVendorToVenue: async (
    venueId: string, 
    vendorId: string
  ): Promise<NonNullable<AssignVendorToVenueMutation["assignVendorToVenue"]>> => {
    const { data } = await client.mutate<
      AssignVendorToVenueMutation,
      AssignVendorToVenueMutationVariables
    >({
      mutation: ASSIGN_VENDOR,
      variables: { venueId, vendorId },
    });

    if (!data?.assignVendorToVenue) {
      throw new Error ("Failed to Assign Vendor to Venue.");
    }

    return data.assignVendorToVenue;
  },

  featuredVenue: async (
    venueId: string,
    featured: boolean
  ): Promise<NonNullable<FeatureVenueMutation["featuredVenue"]>> => {
    const { data } = await client.mutate<
      FeatureVenueMutation,
      FeatureVenueMutationVariables
    >({
      mutation: FEATURE_VENUE,
      variables: { venueId, featured },
    });

    if (!data?.featuredVenue) {
      throw new Error("Failed to feature Venue.")
    }
    return data.featuredVenue;
  },  
};

// interface LoginResponse {
//   message: string;
//   user: User;
// }
type LoginResponse = NonNullable<LoginMutation["login"]>;

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await client.query<GetUsersQuery>({ query: GET_USERS, });

    return data?.users ?? [];
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await client.query<GetUserQuery>({
      query: GET_USER,
      variables: { id: id },
    });

    if (!data?.user) {
      throw new Error("User not found.");
    }
    return data.user;
  },
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await client.mutate<
      LoginMutation,
      LoginMutationVariables
    >({
      mutation: LOG_IN,
      variables: { email, password },
    });

    if (!data?.login?.user) {
      throw new Error("Login failed");
    }

    return data.login;
  },

};
