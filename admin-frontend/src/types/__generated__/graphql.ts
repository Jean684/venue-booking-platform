/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type CreateVenueInput = {
  description: string;
  guests: number;
  heading: string;
  imgUrl: string;
  keywords?: string | null | undefined;
  location: string;
  price: number;
  vendorId: string | number;
};

export type UpdateVenueInput = {
  description?: string | null | undefined;
  guests?: number | null | undefined;
  heading?: string | null | undefined;
  imgUrl?: string | null | undefined;
  keywords?: string | null | undefined;
  location?: string | null | undefined;
  price?: number | null | undefined;
};

export type GetVenuesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVenuesQuery = { venues: Array<{ __typename: 'Venue', description: string, guests: number, heading: string, imgUrl: string, keywords: string | null, location: string, price: number, vendorId: string, venueId: string, featured: boolean }> };

export type GetVenueQueryVariables = Exact<{
  venueId: string | number;
}>;


export type GetVenueQuery = { venue: { __typename: 'Venue', description: string, guests: number, heading: string, imgUrl: string, keywords: string | null, location: string, price: number, vendorId: string, venueId: string, featured: boolean, vendor: { __typename: 'User', id: string, name: string | null } } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ __typename: 'User', id: string, name: string | null, email: string, role: string, phone: string | null }> };

export type GetUserQueryVariables = Exact<{
  id: string | number;
}>;


export type GetUserQuery = { user: { __typename: 'User', id: string, name: string | null, email: string, role: string, phone: string | null } | null };

export type CreateVenueMutationVariables = Exact<{
  input: CreateVenueInput;
}>;


export type CreateVenueMutation = { createVenue: { __typename: 'Venue', venueId: string, vendorId: string, heading: string, location: string, description: string, imgUrl: string, guests: number, price: number, keywords: string | null } };

export type UpdateVenueMutationVariables = Exact<{
  venueId: string | number;
  input: UpdateVenueInput;
}>;


export type UpdateVenueMutation = { updateVenue: { __typename: 'Venue', venueId: string, vendorId: string, heading: string, location: string, description: string, imgUrl: string, guests: number, price: number, keywords: string | null } };

export type DeleteVenueMutationVariables = Exact<{
  venueId: string | number;
}>;


export type DeleteVenueMutation = { deleteVenue: boolean };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { __typename: 'LoginResponse', message: string, user: { __typename: 'User', id: string, email: string, role: string, name: string | null } } | null };

export type AssignVendorToVenueMutationVariables = Exact<{
  venueId: string | number;
  vendorId: string | number;
}>;


export type AssignVendorToVenueMutation = { assignVendorToVenue: { __typename: 'Venue', vendorId: string, venueId: string, vendor: { __typename: 'User', id: string, name: string | null } } };

export type FeatureVenueMutationVariables = Exact<{
  venueId: string | number;
  featured: boolean;
}>;


export type FeatureVenueMutation = { featuredVenue: { __typename: 'Venue', featured: boolean, venueId: string, heading: string } };
