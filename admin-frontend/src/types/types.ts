// Contains all the types/interfaces used
export interface Venue {
    venueId: string;
    vendorId: string; // Optional, only for venues that belong to a vendor
    imgUrl: string;
    heading: string;
    guests: number;
    location: string;
    price: number;
    description: string;
    disableDateRange?: {
        start: string;
        end: string;
    }[]
    keywords: string | null;
    featured: boolean;
}

export interface User {
    //user: User;
    id: string;
    //role: "hirer" | "vendor" | "admin";
    role: string;
    email: string;
    //password: string;
    phone: string | null;
    name: string | null;
    dateJoined?: string;
    documents?: string;
    ratingAverage?: number | string;
    ratingCount?: number;
}

export interface Hirer extends User {
    // Probably not needing preferredVenue
    preferredVenue?: string[];
    //documents?: string[];
}

export interface Vendor extends User {
    applications?: string[] // stores a string array of applicationId
    ownVenuesList?: string[] // stores a string array of venueId that they own
}

// Application is created when hirer applies for a venue, and is stored in the system until the event is completed
export interface Application {
    applicationId: string;  
    venueId: string;
    hirerId: string;
    eventName: string;
    guestCount: number;
    startDate: string;
    endDate: string;
    // for later
    status: "Pending" | "Accepted" | "Rejected";
    rating?: number | string; // 
    rated?: boolean; // to check if the application has been rated by the hirer after the event
    comment?: string; // for accepted events

    _user_: User; // to store the user details of the hirer for easy access when vendor views the application
    _venue_: Venue; // to store the venue details for easy access when hirer views the application
}

export interface Blockdate {
    blockdateId: string;
    venueId: string;
    startDate: string;
    endDate: string;
}

export type CreateVenueInput = {
  vendorId: string;
  heading: string;
  location: string;
  description: string;
  imgUrl: string;
  guests: number;
  price: number;
  keywords?: string;
};

export type UpdateVenueInput = {
  heading?: string;
  location?: string;
  description?: string;
  imgUrl?: string;
  guests?: number;
  price?: number;
  keywords?: string;
};

type GetVenuesResponse = {
  venues: Venue[];
};