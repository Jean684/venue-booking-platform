import { Box, Text, Heading, VStack, Grid, GridItem, Flex, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Header from "@/components/ui/Header";
import Sidebar from '@/components/ui/Sidebar';
import Footer from '@/components/ui/Footer';
import { useEffect } from "react";
import { useState } from "react";
import { mockEvents, mockVenues } from "@/types/data";
import { Application, Venue } from "@/types/types";
import { Button, ButtonGroup } from "@chakra-ui/react";
import DatePicker from 'react-datepicker';

import { start } from "repl";
import { applicationService, UserService, venueService } from "@/services/api";

const Applications = () => {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [venueList, setVenueList] = useState<Venue[]>([]);
    const [user, setUser] = useState<any>(null);

    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [users, setUsers] = useState<any[]>([]);

    const fetchVenuesByVendors = async (vendorId: string) => {
      try {
        const data = await venueService.getVenuesByVendor(vendorId);
        setVenueList(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    const fetchAllApps = async () => {
        try {
          const data = await applicationService.getAllApplication();
          setApplications(data);
        } catch (error) {
          console.error("Error fetching applications:", error);
        }
    };

    const fetchAllUsers = async () => {
        try {
          const data = await UserService.getAllUsers();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching applications:", error);
        }
    };  


    useEffect(() => {
        // Simulate fetching user data
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchVenuesByVendors(parsedUser.id)
        }

        // const storedApps = localStorage.getItem("applications");
        // if (storedApps) {
        //   setApplications(JSON.parse(storedApps));
        // }

        // const storedUsers = localStorage.getItem("users");
        // if (storedUsers) {
        //   setUsers(JSON.parse(storedUsers));
        // }

        fetchAllUsers()
        fetchAllApps()

        // let storedVenues = localStorage.getItem("venues");
        // if (!storedVenues) {
        //     storedVenues = JSON.stringify(mockVenues);
        //     localStorage.setItem("venues", JSON.stringify(mockVenues));
        // } else {
        //     setVenueList(JSON.parse(storedVenues));
        // }

        //debugging
        // console.log("Applications:", applications);
    }, []);  

    // const myVenues = user
    //     ? venueList.filter(venue => venue.vendorId === user.id)
    //     : [];
    const myVenues = venueList;

  return (
    <>
        <Header />

        <Grid templateColumns="repeat(8, 1fr)">
            <Sidebar />
            
            <GridItem colSpan={7} bg="#f3f3f3" minH="100vh"> 
                <Box p={6}>
                    <Heading as="h2" fontSize="5xl" color="#7a051d" mb={6}>
                        Applications
                    </Heading>

                    {myVenues.length === 0 ? (
                        <Text>No venues found.</Text>
                    ) : (
                      <Box>
                        <ButtonGroup mb={4}>
                            <Button
                                variant="outline"
                                onClick={() => setSortDirection("desc")}
                                colorScheme={sortDirection === "desc" ? "red" : "gray"}
                            >
                                Sort Highest Rating
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setSortDirection("asc")}
                                colorScheme={sortDirection === "asc" ? "red" : "gray"}
                            >
                                Sort Lowest Rating
                            </Button>

                            </ButtonGroup>

                        {myVenues.map((venue: Venue) => {

                            const venueApplications = applications
                                .filter((app) => app.__venue__.venueId === venue.venueId)
                                .map((app) => {
                                    const hirer = users.find((u) => u.id === app.__user__.id);

                                    return {
                                    ...app,
                                    hirerRating: Number(hirer?.ratingAverage ?? 0),
                                    };
                                });

                                if (sortDirection === "desc") {
                                    venueApplications.sort((a, b) => b.hirerRating - a.hirerRating);
                                }

                                if (sortDirection === "asc") {
                                    venueApplications.sort((a, b) => a.hirerRating - b.hirerRating);
                                }

                                return (
                                    <Box key={venue.venueId} mb={8} p={4} bg="white" borderRadius="md" boxShadow="sm" >
                                        
                                        <Flex align={'center'} justify={'space-between'}>
                                            <Box as="div">
                                                <Heading size="md">{venue.heading}</Heading>
                                                <Text>{venue.location}</Text>
                                            </Box> 
                                        </Flex>

                                        {venueApplications.length === 0 ? (
                                            <Text mt={4}>No applications for this venue.</Text>
                                        ) : (
                                            <Flex wrap="wrap" mt={4}>
                                                {venueApplications.map((app) => (
                                                    <Box 
                                                        key={app.applicationId}
                                                        onClick={() => router.push(`/vendor/view-event/${app.applicationId}`)}
                                                        cursor="pointer"
                                                        _hover={{transform: "scale(1.02)", transition: "0.2s", bg: 'gray.100'}}
                                                        _active={{bg: 'gray.200'}}
                                                        p={4}
                                                        bg="white"
                                                        borderRadius="md"
                                                        boxShadow="sm"
                                                        m={2}
                                                    >
                                                        <Text fontWeight="bold">{app.eventName}</Text>
                                                        <Text>Guests: {app.guestCount}</Text>
                                                        <Text>Status: {app.status}</Text>
                                                        <Text>Hirer Rating: {app.hirerRating != null ? app.hirerRating.toFixed(2) : "NA"}</Text>
                                                    </Box>
                                                ))}
                                            </Flex>
                                        )}
                                    </Box>
                            );
                        })} 
                        </Box>
                    )}
                </Box>
            </GridItem>
        </Grid> 

        <Footer />
    </>
  );
};

export default Applications;