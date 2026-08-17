import { User, Venue, Hirer, Vendor, Application } from "./types";

// Generated with ChatGPT based on interfaces in types.ts
export const mockUsers: (User | Hirer | Vendor)[] = [
  {
    id: "u1",
    role: "hirer",
    email: "emma.hirer@example.com",
    //password: "hirer123",
    phone: "",
    name: "", 
    documents: "driver",
    ratingAverage: 0,
    ratingCount: 0,
  },
  {
    id: "u2",
    role: "vendor",
    email: "liam.vendor@example.com",
    //password: "vendor123",
    phone: "",
    name: ""
  },
  {
    id: "u3",
    role: "hirer",
    email: "olivia.hirer@example.com",
    //password: "hirer456",
    phone: "",
    name: "",
    documents: "currency, business",
    ratingAverage: 0,
    ratingCount: 0,
  },
  {
    id: "u4",
    role: "vendor",
    email: "dana.vendor@example.com",
    //password: "vendor456",
    phone: "",
    name: ""
  },
  {
    id: "u5",
    role: "vendor",
    email: "timothee.vendor@example.com",
    //password: "vendor789",
    phone: "",
    name: ""
  }
];

// =================== Venues ===============
export const mockVenues: Venue[] = [
  {
    venueId: "v1",
    vendorId: "u2",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2025/10/Bar-Bambi-Melbourne-Functions-CBD-Rooms-Hire-Venues-Party-Birthday-Friends-Corporate-Events-Cocktails-Dancing-Live-Music-Good-Food-Italian-001.jpg",
    heading: "Bar Bambi",
    guests: 120,
    location: "Melbourne CBD",
    price: 85,
    description: "The Restaurant area on the lower level of the venue is available to be cordoned off exclusively for your special occasion from Thursday - Sunday during normal hours of trade.",
    disableDateRange: [
      {
        start: "2026-04-20",
        end: "2026-04-22",
      },
      {
        start: "2026-04-25",
        end: "2026-04-26",
      }
    ],
    keywords: "restaurant, wedding",
    featured: false
  },
  {
    venueId: "v2",
    vendorId: "u2",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2023/09/Hophaus-venue-hire-melbourne-function-rooms-venues-birthday-party-event-wedding-engagement-corporate-room-small-event-southbank-015.jpg",
    heading: "Hophaus",
    guests: 200,
    location: "Southbank",
    price: 95,
    description: "With an expansive art deco-inspired dining hall, including their glazed polychrome brick centrepiece bier bar with 30 draught bier taps and an open rotisserie-fired kitchen, you will quickly agree that Hophaus delivers on its mission to make you and your belly happy with its delicious German & European inspired menu, and warm, contemporary surrounds.",
    featured: true,
    disableDateRange: [
      {
        start: "2026-05-01",
        end: "2026-05-03",
      }
    ],
    keywords: "bar, birthday, party, cafes"
  },
  {
    venueId: "v3",
    vendorId: "u2",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2024/06/Moon-Dog-Wild-West-Function-Venues-Melbourne-Venue-Hire-Footscray-Rooms-Fun-Corporate-Event-Team-Building-Birthday-Party-Wedding-Anniversary-Cool-Engagement-1.jpg",
    heading: "Moon Dog Wild West",
    guests: 300,
    location: "Docklands",
    price: 70,
    description: "Backed by Moon Dog’s renowned hospitality and flair for bold, exciting venues, Doglands delivers atmosphere and flavour in equal measure. With a flexible floor plan and an experienced team on hand, the space can be tailored to suit everything from casual dining to large-scale celebrations.",
    featured: true,
    disableDateRange: [],
    keywords: "restaurant, birthday, party"
  },
  {
    venueId: "v4",
    vendorId: "u4",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2016/01/Carlton-Club-Function-Venues-Melbourne-Venue-Hire-CBD-Rooms-Rooftop-Event-Spaces-Birthday-Party-Corporate-Room-Unique-001.jpg",
    heading: "The Carlton Club",
    guests: 350,
    location: "Melbourne CBD",
    price: 120,
    description: " The venue spans across multiple levels, each with its own energy and decor. Featuring a range of unique indoor and outdoor function spaces, it’s perfect for intimate booth dinners, rooftop takeovers or club nights for up to 300 guests.",
    featured: true,
    disableDateRange: [],
    keywords: "restaurant, party"
  },
  {
    venueId: "v5",
    vendorId: "u4",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2023/06/glasshaus-function-venues-melbourne-venue-hire-cocktail-party-functions-warehouse-rooms-private-room-open-spaces-event-space-corporate-events-small-012.jpg",
    heading: "Glasshaus",
    guests: 180,
    location: "Richmond",
    price: 110,
    description: "A bright and modern venue surrounded by parklands, offering floor-to-ceiling windows and natural light.",
    featured: true,
    disableDateRange: [],
    keywords: "restaurant, wedding, cafes"
  },
  {
    venueId: "v6",
    vendorId: "u4",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2024/04/death-or-glory-restaurant-restaurants-pub-pubs-diner-eats-food-drinks-prahran-melbourne-14.jpg",
    heading: "Death or Glory",
    guests: 150,
    location: "Prahran",
    price: 95,
    description: "Death or Glory is a Bar & Restaurant located in the bustle of Chapel St in Prahran. With a killer menu, trivia and comedy nights and a wide range of food and drink, your whole week is literally sorted.",
    featured: true,
    disableDateRange: [],
    keywords: "restaurant, bar"   
  },
  {
    venueId: "v7",
    vendorId: "u5",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2024/12/Blossom-Rooftop-Bar-Function-Venues-Melbourne-Venue-Hire-CBD-Rooms-Birthday-Party-City-View-Engagement-Wedding-Corporate-13.jpg",
    heading: "Blossom Rooftop Bar",
    guests: 250,
    location: "Melbourne CBD",
    price: 130,
    description: "A rooftop venue with stunning city skyline views and a luxurious contemporary atmosphere.",
    featured: true,
    disableDateRange: [],
    keywords: "bar, birthday, party"
  },
  {
    venueId: "v8",
    vendorId: "u5",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2024/03/The-Tippler-Co-Restaurant-East-Melbourne-Restaurants-Private-Group-Share-Dinning-Top-Best-Good-Casual-Outdoor-Cool-Tapas-011.jpg",
    heading: "The Tippler & Co",
    guests: 140,
    location: "East Melbourne",
    price: 100,
    description: "Located only a stone’s throw from the MCG, The Tippler & Co is a lush plant-filled bar and eatery that has been built on a passion for good hospitality, food and drink.",
    featured: true,
    disableDateRange: [],
    keywords: "restaurant, bar"   
  },
  {
    venueId: "v9",
    vendorId: "u5",
    imgUrl: "https://www.hiddencitysecrets.com.au/wp-content/uploads/2025/09/Chiki-Chan-Restaurant-Melbourne-Aisan-Fusion-Mordialloc-Dinner-Drinks-Wine-Bayside-Restaurants-Family-Friends-Good-Food-Live-Music-001.jpg",
    heading: "Chiki Chan",
    guests: 300,
    location: "Mordialloc",
    price: 115,
    description: "Chiki Chan brings a fresh twist to Melbourne’s dining scene with a menu that fuses Asian flavours and modern Australian favourites.",
    featured: false,
    disableDateRange: [],
    keywords: "restaurant, party, birthday"
  }
];

// ========= Saved Venues ===========
export const mockedSavedVenues: string[] = [
  "v3", "v2", "v1"
]

// ========= Mock no venues =========
export const mockNoVenues: Venue[] = []

// ========= Event ==================
//export const mockEvents: Application[] = [
const mockEventsWithoutRelations: Omit<
  Application,
  "__user__" | "__venue__"
  >[] = [
  {
    applicationId: "a1",
    venueId: "v1",        // Bar Bambi (vendor u2)
    hirerId: "u1",        // Emma (hirer)
    eventName: "Emma's Birthday Bash",
    guestCount: 80,
    startDate: "",
    endDate: "",
    status: "Accepted",
    rating: 4
  },
  {
    applicationId: "a2",
    venueId: "v1",        // Bar Bambi  (vendor u2)
    hirerId: "u3",        // Olivia (hirer)
    eventName: "Engagement Party",
    guestCount: 150,
    startDate: "",
    endDate: "",
    status: "Rejected"
  },
  {
    applicationId: "a3",
    venueId: "v7",        // Blossom Rooftop Bar (vendor u5)
    hirerId: "u1",        // Emma again (multiple bookings test)
    eventName: "Corporate Networking Night",
    guestCount: 120,
    startDate: "",
    endDate: "",
    status: "Pending"
  },
  {
    applicationId: "a4",
    venueId: "v3",        // Sunset Hall (vendor u2)
    hirerId: "u1",        // Emma again
    eventName: "Birthday Celebration",
    guestCount: 60,
    startDate: "",
    endDate: "",
    status: "Accepted",
    comment: "Client has too many requests",
    rating: 2
  },
  {
    applicationId: "a5",
    venueId: "v2",        // Grand Ballroom (vendor u3)
    hirerId: "u3",        // Another hirer
    eventName: "Wedding Reception",
    guestCount: 200,
    startDate: "",
    endDate: "",
    status: "Accepted",
    comment: "",
    rating: 5
  },
  {
    applicationId: "a6",
    venueId: "v2",        // Blossom Rooftop Bar (vendor u5)
    hirerId: "u3",
    eventName: "Startup Launch Party",
    guestCount: 100,
    startDate: "",
    endDate: "",
    status: "Accepted",
    comment: "Need AV equipment setup before event.",
    rating: 4
  }
];

export const mockEvents: Application[] =
  mockEventsWithoutRelations.map((event) => {
    const user = mockUsers.find((user) => user.id === event.hirerId);
    const venue = mockVenues.find(
      (venue) => venue.venueId === event.venueId
    );

    if (!user || !venue) {
      throw new Error(
        `Invalid mock event references: ${event.applicationId}`
      );
    }

    return {
      ...event,
      __user__: user,
      __venue__: venue,
    };
  });