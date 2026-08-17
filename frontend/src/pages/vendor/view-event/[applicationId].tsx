import { useRouter } from "next/router";
//import { Box, FormControl, Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/react";
import { Box, VStack, FormControl, FormLabel, Input, Grid, GridItem, Heading, Text, ButtonGroup, Button, Flex, useToast, Tbody, Table, TableContainer, Th, Thead, Tr, Td, Checkbox, CheckboxGroup, NumberInput, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper } from "@chakra-ui/react";
import { mockEvents, mockUsers, mockVenues } from "@/types/data";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/ui/Footer";
import { useEffect, useState } from "react";
import { Application, User, Venue } from "@/types/types";
import { start } from "repl";
import { applicationService, blockdateService, UserService, venueService } from "@/services/api";

const ApplicationDetails = () => {
  const router = useRouter();

  const applicationId = 
    typeof router.query.applicationId === "string"
    ? router.query.applicationId
    : null;
  // State for comment, accept/reject and rating function
  const [ comment, setComment ] = useState<string>('')
  const [ accept, setAccept ] = useState<string>('');
  // const [ rating, setRating ] = useState<number>(0);

  // State for current user (vendor) and current application from hirer being viewed
  const [rating, setRating] = useState<number | "">("");
  
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);
  const [ application, setApplication ] = useState<Application | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [ hirer, setHirer] = useState<User>()
  
  // States for application and document lists of hirer
  const [ applicationList, setApplicationList] = useState<Application[]>([])
  const [ documentList, setDocumentList] = useState<(string)[]>([])
  const [isClient, setIsClient] = useState<boolean>(false);
  
  const toast = useToast();

  // Fetch all applications from mock data
  // use conditions to know which application to display + set comment
  // useEffect(() => {
  //   setIsClient(true); // Ensure this runs only on the client side

  //   // const users = fetchAllUsers();
  //   // const existingApps = fetchAllApplications();
  //   const users = localStorage.getItem("users");
  //   const existingApps = localStorage.getItem("applications");

  //   // fetchAllUsers();

  //   if (existingApps) {
  //     const apps = existingApps ? JSON.parse(existingApps) : [];
  //     const userList = users ? JSON.parse(users) : [];

  //     // setApplicationList(apps)

  //     const found = apps.find((app: Application) => app.applicationId === applicationId);
  //     const hirer = userList.find((u: User) => u.id === found.hirerId);

  //     if (found) {
  //       const hirer = userList.find((u: User) => u.id === found.hirerId);

  //       //debugging
  //       console.log("Hirer debug:", hirer);

  //       // const hirer = userList.find((u: User) => u.id === found.hirerId);
  //       setApplication(found);
  //       setComment(found.comment || "");
  //       setAccept(found.status || "");
  //       // setRating(found.rating || 0)
  //       setDocumentList(hirer.document || []);
  //     }

  //     if (!found) {
  //       // Debug
  //       console.log("Application not found for id:", applicationId);
  //       return;
  //     } else {
  //       return
  //     }
  //   }
  // }, [applicationId]);

  useEffect (() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      const currentUserObject = JSON.parse(currentUser)
      setCurrentUser(currentUserObject);
    }
  }, [])

  useEffect(() => {
    setIsClient(true);
    if (!applicationId) return;

    const loadData = async () => {
      const apps = await applicationService.getAllApplication();
      const users = await UserService.getAllUsers();

      const found = apps.find(
        (app) => app.applicationId === applicationId
      );

      if (!found) return;
      
      setApplicationList(apps)

      const hirer = users.find(
        (u) => u.id === found.__user__.id
      );

      console.log("found", found);
      // console.log("found.hirerId", found.__user__.id);
      // console.log("found.__user__", found.__user__);


      setHirer(hirer)
      setApplication(found);
      setComment(found.comment || "");
      setAccept(found.status || "");

      setRating(
        found.rating !== undefined && found.rating !== null
          ? Number(found.rating)
          : ""
      );

      // console.log(hirer.documents.split(","))
      setDocumentList(
        hirer?.documents
          ? hirer.documents.split(",")
          : []
      );
    };

    loadData();
  }, [applicationId]);


  // Similar to above - fetch applications to compare id before updating comment
  // const handleSaveComment = async () => {
  //   const stored = localStorage.getItem("applications");
  //   if (!stored || !applicationId) return;

  //   const apps = JSON.parse(stored);

  //   const updatedApps = apps.map((app: Application) =>
  //     app.applicationId === applicationId
  //       ?{ ...app, comment: comment }
  //       : app
  //   );

  //   setApplication((prev) => prev ? { ...prev, comment } : prev); // Update local state immediately for better UX
  //   localStorage.setItem("applications", JSON.stringify(updatedApps));

  //   //then save it back to local storage

  //   setApplicationList(updatedApps);
  //   //setApplication((prev) => ({ ...prev, comment, rating })); // might crash if prev is null, need to check first

  //   // } else {
  //     toast({
  //       title: "Success!",
  //       description: "Comment saved successfully.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  // };

  const handleSaveComment = async () => {
    if (!applicationId) return;

    const apps = await applicationService.getAllApplication();

    if (!apps || !applicationId) return;

    const updatedApps = apps.map((app: Application) =>
      app.applicationId === applicationId
        ? { ...app, comment: comment }
        : app
    );

    const updatedApp = await applicationService.updateApplication (
      applicationId, { comment: comment }
    );

    setApplication((prev) => prev ? { ...prev, comment } : prev); // Update local state immediately for better UX
    setApplicationList(updatedApps);

    toast({
      title: "Success!",
      description: "Comment saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // const handleRating = () => {
  //   const stored = localStorage.getItem("applications");
  //   const storedUsers = localStorage.getItem("users");

  //   if (!storedUsers|| !application || !stored) return;

  //   const apps: Application[] = JSON.parse(stored);
  //   const users: User[] = JSON.parse(storedUsers);

  //   const targetApp = apps.find((app) => app.applicationId === applicationId);

  //   // 1 rating per application, if rating already exists, prevent re-rating - less abusive but also less flexible for genuine mistakes, maybe add an edit rating function later?
  //   if (targetApp?.rated) {
  //     toast({
  //       title: "Already Rated",
  //       description: "You have already rated this application.",
  //       status: "warning",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   const updatedApps = apps.map(app => {
  //     if (app.applicationId !== applicationId) return app;

  //     return {
  //       ...app,
  //       rating: rating,
  //       rated: true
  //     }
  //   });

  //   const updatedUsers = users.map((u) => {
  //     if (u.id !== application?.hirerId) return u;

  //       const oldRating = u.rating || 0;
  //       const oldCount = u.ratingCount || 0;

  //       const newCount = oldCount + 1;
  //       const newRating = ((oldRating * oldCount) + Number(rating)) / newCount;

  //       return {
  //         ...u,
  //         rating: newRating,
  //         ratingCount: newCount
  //       }
  //   });

  //   setUsers(updatedUsers);
  //   localStorage.setItem("users", JSON.stringify(updatedUsers));
  //   setApplicationList(updatedApps);
  //   localStorage.setItem("applications", JSON.stringify(updatedApps));

  //   // Toast to confirm success
  //   toast({
  //     title: "Success!",
  //     description: "Your rating has been saved",
  //     status: "success",
  //     duration: 3000,
  //     isClosable: true,
  //   });
  // };  

  const handleRating = async () => {

    if (!application || 
        !applicationId ||
        typeof applicationId !== "string"
      ) {
        return;
      }
    
    if (rating === ""){
      toast({
        title: "Rating required",
        description: "Please enter a rating.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const numericRating = Number(rating);

      await applicationService.updateApplication(applicationId, { rating: numericRating });

      setApplication((previousApplication) =>
        previousApplication 
          ? { ...previousApplication, 
              rating: numericRating, 
              rated: true } 
            : previousApplication
          );

          setApplicationList((previousApplications) =>
            previousApplications.map((app) =>
              app.applicationId === applicationId
                ? { ...app, rating: numericRating, rated: true }
                : app
            )
          );

      toast({
        title: "Success!",
        description: "Your rating has been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving rating:", error);

      toast({
        title: "Unable to Save Rating",
        description: "An error occurred while saving your rating. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAccept = async (
    status: Application["status"]
  ) => {
    // const stored = localStorage.getItem("applications");
    // const storedVenues = localStorage.getItem("venues");

    // if (!stored || !storedVenues) return;

    // const apps = JSON.parse(stored);
    // const venues = JSON.parse(storedVenues);
    if (!currentUser) return;

    const apps = await applicationService.getAllApplication();
    const venues = await venueService.getVenuesByVendor(currentUser.id)

    if (!apps || !venues) return;

    const app = apps.find(
      (a: Application) => a.applicationId === applicationId
    );

    // Put in the new status: accepted/ rejected
    const updatedApps = applicationList.map((app) =>
      app.applicationId === applicationId
        ? { ...app, status }
        : app
    );

    // When accepted
    // Put blocked dates into venue so other hirers cannot select anymore
    if (status === "Accepted") {
      if (!app) return;

      await blockdateService.createBlockdate({
        venueId: app.__venue__.venueId,
        startDate: app.startDate,
        endDate: app.endDate,
      });
      // const matchingId = apps.map((app: Application) => {
      //   if (app.applicationId === applicationId) {
      //     const venue = venues.find((v: Venue) => v.venueId === app.__venue__.venueId);

      //     if (venue) {
      //       // Replace the venue.disableDateRange with a new array
      //       // that contains all old items
      //       // and add the new one at the end
      //       venue.disableDateRange = [
      //         ...venue.disableDateRange, 
      //         {
      //           start: app.startDate,
      //           end: app.endDate,
      //         }
      //       ];
      //     }
      // }});
    }
    if (!applicationId) return;

    const updatedApp = await applicationService.updateApplication (
      applicationId, { status: status }
    );

    setApplication((prev) => 
      prev ? { ...prev, status: updatedApp.status } : prev
    );

    setApplicationList(updatedApps);
    // localStorage.setItem("applications", JSON.stringify(updatedApps));
    // localStorage.setItem("venues", JSON.stringify(venues));

    // Toast to confirm success
    toast({
      title: "Success!",
      description: `The applicant has been ${status.toLowerCase()}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  if (!applicationId || typeof applicationId !== "string") {
    return <Text>Loading...</Text>;
  }

  const hiringHistoryList = applicationList
    .filter((a) => a.__user__.id === application?.__user__.id)
    .map((a) => {
      const venue = a.__venue__

      return (
     
        <Tr key={a.applicationId}>
          <Td>{venue?.heading}</Td>
          <Td>{venue?.location}</Td>
          <Td>{a.eventName}</Td>
          <Td>{a.startDate}</Td>
          <Td>{a.endDate}</Td>
          <Td>{a.status}</Td>
          <Td isNumeric>{a.guestCount}</Td>
          <Td isNumeric>{a.rating ?? "NA"}</Td>
        </Tr>
      )
  });  

  const score = documentList?.reduce((total, d) => {
    if (d === "driver")   { return total + 2 } 
    if (d === "currency") { return total + 1 } 
    if (d === "business") { return total + 2 }
    return total;
  }, 0)

  if (!application) {
    return <Text>Application not found</Text>;
  }

  return (
    <>
      <Header />
      <Grid templateColumns="repeat(8, 1fr)">
        <Sidebar />
        <GridItem colSpan={7} bg="#f3f3f3" minH="100vh">
          <Box p={6}>
            
            <Heading as="h2" fontSize="5xl" color="#7a051d" mb={6}>
              Applications Details
            </Heading>

          <Tabs align='center' size={'lg'} defaultIndex={0} colorScheme="red" >  
            <TabList>
              <Tab>Application</Tab>
              <Tab>Hiring History</Tab>
              <Tab>ID Document</Tab>
            </TabList>
              
            <TabPanels>
              {/* 1. Application Tab */}
              <TabPanel>
                 {application && (
                 <Box maxW="700px" mx="auto" mt={6}>
                   <VStack spacing={5} align="stretch">
                  
                    <FormControl>
                      <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Event Name</FormLabel>
                      <Input value={application.eventName} isReadOnly />
                    </FormControl>
                  
                    <FormControl>
                      <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Number of Guests</FormLabel>
                      <Input value={application.guestCount} isReadOnly />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Event Date</FormLabel>
                      <Input value={
                        application.startDate && application.endDate ? `${application.startDate} to ${application.endDate}` : ""
                      } isReadOnly />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Comment</FormLabel>
                      <Flex gap={4}>
                        <Input value={comment}  onChange={(e) => setComment(e.target.value)}/>
                        <Button bg={'blackAlpha.200'} borderColor={'blackAlpha.200'} _hover={{ bg: 'blackAlpha.300'}} onClick={handleSaveComment}>Save</Button>
                      </Flex>
                    </FormControl>

                    {application.status === "Accepted" && !application.rated && (
                      <>
                        <FormControl>
                          <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Rating (out of 5)</FormLabel>
                          <Flex gap={4}>
                            <NumberInput
                              width={'100%'}
                              step={0.5}
                              min={0}
                              max={5}
                              value={rating}
                              onChange={(valueAsString, valueAsNumber) => 
                                setRating(valueAsString === "" ? "" : valueAsNumber)
                              }
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <Button bg={'blackAlpha.200'} borderColor={'blackAlpha.200'} _hover={{ bg: 'blackAlpha.300'}} onClick={handleRating}>Rate</Button>
                          </Flex>
                        </FormControl>
                      </>
                    )}          

                    {application.rating !== undefined && application.rating !== null && (
                      <>
                      <Text fontSize={'lg'}>
                          Rating Submitted: {Number(application.rating).toFixed(1)} / 5
                      </Text>
                      </>
                    )}

                    {application.status === "Pending" && (
                      <ButtonGroup mt={6} variant={'outline'}>
                        <Flex flex={1} justifyContent={'center'} gap={8}>
                          <Button 
                            onClick={() => handleAccept('Accepted')} 
                            fontSize={'lg'} 
                            flexGrow={1} 
                            height={12} 
                            colorScheme="green">
                              Accept
                          </Button>
                            
                          <Button 
                            onClick={() => handleAccept('Rejected')} 
                            fontSize={'lg'} 
                            flexGrow={1} 
                            height={12} 
                            colorScheme="red">
                              Reject
                          </Button>
                        </Flex>
                      </ButtonGroup>
                    )}
                    </VStack>
                  </Box>
                )}
              </TabPanel>


              {/* 2. Hiring History */}
              <TabPanel>
                <TableContainer>
                  <Table variant='striped' size={'md'} colorScheme={'blackAlpha'}>
                    <Thead>
                      <Tr>
                        <Th>Venue Name</Th>
                        <Th>Location</Th>
                        <Th>Event Name</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Guests</Th>
                        <Th isNumeric>Rating</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {hiringHistoryList}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* 3. ID */}
              <TabPanel>
                <CheckboxGroup colorScheme='green' value={documentList}>
                  <Flex mt={10} gap={4} direction={'column'} justify={'center'} align={'center'}>
                    <Checkbox value="driver" >
                      <Text fontSize={'xl'}>Driver’s License (2 points)</Text>
                    </Checkbox>
                            
                    <Checkbox value="currency" >
                      <Text fontSize={'xl'}>Certificate of Currency (1 point)</Text>
                    </Checkbox>
                            
                    <Checkbox value="business" >
                      <Text fontSize={'xl'}>Business Register (2 points)</Text>
                    </Checkbox>    
                    <Text fontSize={'xl'} fontWeight={'medium'}>Identity Score: {score} / 5</Text>
                  </Flex>
                </CheckboxGroup>
              </TabPanel>
            </TabPanels>
          </Tabs>
           
          </Box>
        </GridItem>
      </Grid>
      <Footer />
    </>
  );
};

export default ApplicationDetails;