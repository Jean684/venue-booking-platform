/**
 * This file contains the API service layer for the frontend application.
 * It provides two main services:
 *
 * 1. UserService: Handles all User-related API operations
 *    - getAllUsers: Fetches all user (X)
 *    - createUser: Creates a new user User
 *    - getUser: Retrieves a specific User by ID
 *    - updateUser: Update user by ID
 * 
 * 2. ApplicationService:
 *    - getAllApplications
 *    - getApplication
 *    - updateApplication: allows user to comment, rate, accept/reject application
 * 
 * 3. VenueService
 *    - getAllVenues: get all venues (X)
 *    - getVenuesOfVendor: get all venues belong to a vendor
 *    - createVenue: creates a new venue
 *    - updateVenue: update a venue by ID
 *    - deletePet: deletes venue by ID
 * 
 */


//import { json } from "stream/consumers";
import { Application, User, Venue, Blockdate, AnalyticsRange, VendorAnalytics } from "../types/types";

const API_BASE_URL = "http://localhost:3001/api"; // Update this to match your backend API URL

// Helper to handle JSON responses and errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(errorMessage || `HTTP error — status: ${response.status}`);
  }

  //DELETE requests may return 204 No Content, so we should handle that case
  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse<User[]>(response);
  },

  // getDocumentByUser: async (id: string): Promise<User> => {
  //   const response = await fetch(`${API_BASE_URL}/users/${id}`);
  //   return handleResponse<User>(response);
  // },  

  createUser: async (User: {
    email: string;
    passord: string;
  }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(User),
    });
    await handleResponse<void>(response);
  },

  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse<User>(response);
  },

//   deleteUser: async (id: string): Promise<void> => {
//     const response = await fetch(`${API_BASE_URL}/user/${id}`, {
//       method: "DELETE",
//     });
//     await handleResponse<void>(response);
//   },

  updateUser: async (
    id: string,
    User: {
      name: string;
      phone: string;
    }
  ): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(User),
    });
    return handleResponse<User>(response);
  },

  updateDocument: async (
    id: string,
    User: {
      documents: string;
    }
  ): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(User),
    });

    return handleResponse<User>(response);
  },
};

export const venueService = {
  getAllVenues: async (): Promise<Venue[]> => {
    const response = await fetch(`${API_BASE_URL}/venues`);
    return handleResponse<Venue[]>(response);
  },

  searchVenues: async (query: string): Promise<Venue[]> => {
    const response = await fetch(`${API_BASE_URL}/venues/search?q=${(query)}`);
    return handleResponse<Venue[]>(response);
  },

  getVenuesByVendor: async (vendorId: string): Promise<Venue[]> => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/venues`);
    return handleResponse<Venue[]>(response);
  },

  createVenue: async (
    vendorId: string,
    venue: {
      heading: string;
      imgUrl: string;
      guests: number;
      location: string;
      price: number;
      description?: string;
      keywords?: string;
    }
  ): Promise<Venue> => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/venues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venue),
    });
    return handleResponse<Venue>(response);
  },

  updateVenue: async (
    vendorId: string,
    venueId: string,
    venue: {
      heading?: string;
      imgUrl?: string;
      guests?: number;
      location?: string;
      price?: number;
      description?: string;
      keywords?: string;
    }
  ): Promise<Venue> => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/venues/${venueId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venue),
    });
    return handleResponse<Venue>(response);
  },

  deleteVenue: async (vendorId: string, venueId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/venues/${venueId}`, {
      method: "DELETE",
    });
    await handleResponse<void>(response);
  },
};

export const applicationService = {
  getAllApplication: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications`);
    return handleResponse<Application[]>(response);
  },

  getApplication: async (applicationId: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`);
    return handleResponse<Application>(response);
  },

  getAllApplicationByUser: async (userId: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/applications`);
    return handleResponse<Application[]>(response);
  },

  getAllApplicationByVenue: async (venueId: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/applications`);
    return handleResponse<Application[]>(response);
  },  

  createApplication: async (Application : {
      eventName: string,
      guestCount: number,
      startDate: string,
      endDate: string,
      status: string,
  }): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Application),
    });
    return handleResponse<Application>(response);
  },

  updateApplication: async (
    applicationId: string,
    application: {
      status?: string,
      comment?: string,
      rating?: number
    }
  ): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });

    return handleResponse<Application>(response);
  },
}

export const blockdateService = {
  getAllBlockdates: async (): Promise<Blockdate[]> => {
    const response = await fetch(`${API_BASE_URL}/blockdates`);
    return handleResponse<Blockdate[]>(response);
  },

  getOneBlockdate: async (blockdateId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/blockdates/${blockdateId}`);
    return handleResponse<User>(response);
  },

  getBlockdatesByVenue: async (venueId: string): Promise<Blockdate[]> => {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/blockdates`);
    return handleResponse<Blockdate[]>(response);
  },

  getBlockdatesByVendor: async (vendorId: string): Promise<Blockdate[]> => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/blockdates`);
    return handleResponse<Blockdate[]>(response);
  },

  createBlockdate: async (Blockdate : {
    startDate: string,
    endDate: string,
    venueId: string
  }): Promise<Blockdate> => {
    const response = await fetch(`${API_BASE_URL}/blockdates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Blockdate),
    });
    return handleResponse<Blockdate>(response);
  },
  
  deleteBlockdate: async (blockdateId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/blockdates/${blockdateId}`, {
      method: "DELETE",
    });
    await handleResponse<void>(response);
  },
};

export const analyticsService = {
  getVendorAnalytics: async (
    vendorId: string,
    range: AnalyticsRange
  ): Promise<VendorAnalytics> => {
    const response = await fetch(
      `${API_BASE_URL}/vendors/${vendorId}/analytics?range=${range}`
    );

    return handleResponse<VendorAnalytics>(response);
  }
}