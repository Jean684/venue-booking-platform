// Contains all the types/interfaces used

export interface CreateVenueInput {
  vendorId: string;
  heading: string;
  location: string;
  description: string;
  imgUrl: string;
  guests: number;
  price: number;
  keywords?: string;
};

export interface UpdateVenueInput {
  heading?: string;
  location?: string;
  description?: string;
  imgUrl?: string;
  guests?: number;
  price?: number;
  keywords?: string;
};