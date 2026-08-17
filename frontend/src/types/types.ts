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
    featured: boolean;
    disableDateRange?: {
        start: string;
        end: string;
    }[]
    keywords: string;
}

export interface User {
    id: string;
    role: "hirer" | "vendor";
    email: string;
    //password: string;
    phone?: string;
    name?: string;
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

    __user__: User; // to store the user details of the hirer for easy access when vendor views the application
    __venue__: Venue; // to store the venue details for easy access when hirer views the application
}

export interface Blockdate {
    blockdateId: string;
    venueId: string;
    startDate: string;
    endDate: string;
    __venue__: Venue;
}

export type AnalyticsRange =
    | "this-week"
    | "this-month"
    | "last-month"
    | "all-time";

export interface HirerTally {
    forEach(arg0: (hirer: any) => void): unknown;
    hirerId: string;
    hirerName: string;
    tally: number;
}

export interface VenueTally {
    venueId: string;
    venueName: string;
    hirers: HirerTally;
}

export interface CombinedTally {
  hirerId: string;
  hirerName: string;
  venueId: string;
  venueName: string;
  tally: number;
}

export interface UtilizationPoint {
  date: string;
  utilizationPercentage: number;
}

export interface VendorAnalytics {
  range: AnalyticsRange;
  venueCount: number;
  acceptedBookingCount: number;
  venueTallies: VenueTally[];
  combinedTallies: CombinedTally[];
  hirerActivity: HirerTally[];
  mostActiveHirer: HirerTally | null;
  leastActiveHirer: HirerTally | null;
  utilizationTimeline: UtilizationPoint[];
}
