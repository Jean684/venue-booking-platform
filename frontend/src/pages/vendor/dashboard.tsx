import { useState } from "react";
import { Grid, GridItem, Heading, Flex, Box, Text, Card, CardFooter, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Input, Tabs, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tbody, Th, Thead, Tr, Td, useToast, FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/ui/Footer";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Header from "@/components/ui/Header";
import { Application, Blockdate, User, Venue } from "@/types/types";

import VendorVenueCard from "@/components/features/VendorVenueCard";
import { applicationService, venueService, blockdateService } from "@/services/api";
import { a } from "framer-motion/m";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";

const VendorDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dateRange, setDateRange] = useState<string>("")
  const [openVenue, setOpenVenue] = useState<string | null>(null);
  const [venueList, setVenueList] = useState<Venue[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [blockdates, setBlockdates] = useState<Blockdate[]>([]);
  const [venueBlockdates, setVenueBlockdates] = useState<Blockdate[]>([]);
  const toast = useToast();

// Store selected range together with their own venue id in an object
// Otherwise clicking on a single venue change the UI of remaining venues
  const [selectedRanges, setSelectedRanges] = useState<{
    [venueId: string]: {
      start: Date | null;
      end: Date | null;
    };
  }>({});

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
  
  const fetchBlockdatesByVendor = async (vendorId: string) => {
    try {
      const data = await blockdateService.getBlockdatesByVendor(vendorId);
      setBlockdates(data);
    } catch (error) {
      console.error("Error fetching blockdates:", error);
    }
  };

  const fetchBlockdatesByVenue = async (venueId: string) => {
    try {
      const data = await blockdateService.getBlockdatesByVenue(venueId);
    } catch (error) {
      console.error("Error fetching venue blockdates:", error);
    }
  };

  useEffect(() => {
    // Simulate fetching user data
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchVenuesByVendors(parsedUser.id);
      fetchBlockdatesByVendor(parsedUser.id);
    }
    fetchAllApps()
  }, []);

  const myVenues = venueList;

  const handleDeleteDate = async (blockdateId: string) => {
    await blockdateService.deleteBlockdate(blockdateId)

    toast({
      title: "Success!",
      description: "Block date has been successfully deleted",
      status: "success",
      duration: 5000,
    }); 
  }

  const handleDateChange = async (
    // Take in start and end date + venue id
    date: [Date | null, Date | null],
    venueId: string
  ) => {
    const [start, end] = date;

    // Formatting dates
    // Safer to use en-CA locale date than en-AU as it follows ISO
    const formatLocalDate = (date: Date) => {
      return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };

    // Only save when available
    setSelectedRanges((prev) => ({
      ...prev,
      [venueId]: { start, end },
    }));    

    if (!start || !end) return;

    const newRange = {
      startDate: formatLocalDate(start),
      endDate: formatLocalDate(end),
      venueId: venueId
    };

    const isOverlap = blockdates.some(r => {
      const overlap =
        start <= new Date(r.endDate) &&
        end >= new Date(r.startDate);

      return (
        start <= new Date(r.endDate) &&
        end >= new Date(r.startDate)
      )
    })


    if (isOverlap) {
      toast({
        title: "This time slot has been blocked already!",
        description: "Please try again with another date",
        status: "error",
        duration: 5000,
      });
      return;
    }

    await blockdateService.createBlockdate(newRange)
    
    // Confirm success
    toast({
       title: "Success!",
       description: "Block dates added for venue.",
       status: "success",
       duration: 5000,
    });
  }

  const blockDateList = blockdates.map((block, index) => {
      if (!block.startDate || !block.endDate) return null;

      const s = String(block.startDate)
      const e = String(block.endDate)
       
      return (
        <Tr key={index}>
          <Td>{block.__venue__.heading}</Td>
          <Td>{s}</Td>
          <Td>{e}</Td>
          <Td><Button colorScheme='red'variant={'outline'} onClick={() => handleDeleteDate(block.blockdateId)}>Delete</Button></Td>
        </Tr>
      )
    })
  
// Create venue function
  const {
    isOpen: isCreateVenueOpen,
    onOpen: openCreateVenue,
    onClose: closeCreateVenue,
  } = useDisclosure();

// Edit venue function
  const {
    isOpen: isEditVenueOpen,
    onOpen: openEditVenue,
    onClose: closeEditVenue,
  } = useDisclosure();

// Delete venue function
  const {
    isOpen: isDeleteVenueOpen,
    onOpen: openDeleteVenue,
    onClose: closeDeleteVenue,
  } = useDisclosure();

  const [newVenueData, setNewVenueData] = useState({
    heading: "",
    imgUrl: "",
    guests:"",
    location: "",
    price: "",
    description: "",
    keywords: "",
  });

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [editVenueData, setEditVenueData] = useState({
    heading: "",
    imgUrl: "",
    guests:"",
    location: "",
    price: "",
    description: "",
    keywords: "",
  });

  const handleCreateVenue = async () => {
    if (!user) return;

    if (
      !newVenueData.heading.trim() ||
      !newVenueData.guests ||
      !newVenueData.location.trim() ||
      !newVenueData.price ||
      !newVenueData.imgUrl.trim() ||
      !newVenueData.description.trim() ||
      !newVenueData.keywords.trim()
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      Number(newVenueData.guests) < 1 ||
      Number(newVenueData.price) < 1
    ) {
      toast({
        title: "Invalid venue details",
        description: "Please ensure all numeric fields are valid.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await venueService.createVenue(user.id, {
        heading: newVenueData.heading,
        imgUrl: newVenueData.imgUrl,
        guests: Number(newVenueData.guests),
        location: newVenueData.location,
        price: Number(newVenueData.price),
        description: newVenueData.description,
        keywords: newVenueData.keywords,
      });

      await fetchVenuesByVendors(user.id);

      toast({
        title: "Venue created",
        description: "Your new venue has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewVenueData({
        heading: "",
        imgUrl: "",
        guests: "",
        location: "",
        price: "",
        description: "",
        keywords: "",
      });

      closeCreateVenue();

    } catch (error) {
      toast({
        title: "Error creating venue",
        description: "An error occurred while creating the venue.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openEditVenueModal = (venue: Venue) => {
    setSelectedVenue(venue);

    setEditVenueData({
      heading: venue.heading ?? "",
      imgUrl: venue.imgUrl ?? "",
      guests: String(venue.guests) ?? "",
      location: venue.location ?? "",
      price: String(venue.price) ?? "",
      description: venue.description ?? "",
      keywords: venue.keywords ?? "",
    });
    openEditVenue();
  };

  const closeEditVenueModal = () => {
    closeEditVenue();
    setSelectedVenue(null);
  };

  const handleUpdateVenue = async () => {
    if (!user || !selectedVenue) return;

    if (
      !editVenueData.heading.trim() ||
      !editVenueData.guests ||
      !editVenueData.location.trim() ||
      !editVenueData.price ||
      !editVenueData.imgUrl.trim() ||
      !editVenueData.description.trim() ||
      !editVenueData.keywords.trim()
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      Number(editVenueData.guests) < 1 ||
      Number(editVenueData.price) < 1
    ) {
      toast({
        title: "Invalid venue details",
        description: "Please ensure all numeric fields are valid.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await venueService.updateVenue(user.id, selectedVenue.venueId, {
        heading: editVenueData.heading,
        imgUrl: editVenueData.imgUrl,
        guests: Number(editVenueData.guests),
        location: editVenueData.location,
        price: Number(editVenueData.price),
        description: editVenueData.description,
        keywords: editVenueData.keywords,
      });

      await fetchVenuesByVendors(user.id);

      toast({
        title: "Venue updated",
        description: "Your venue has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeEditVenueModal();

    } catch (error) {
      toast({
        title: "Error updating venue",
        description: "An error occurred while updating the venue.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openDeleteVenueModal = (venue: Venue) => {
    setSelectedVenue(venue);
    openDeleteVenue();
  };

  const closeDeleteVenueModal = () => {
    closeDeleteVenue();
    setSelectedVenue(null);
  };

  const handleDeleteVenue = async () => {
    if (!user || !selectedVenue) return;

    try {
      await venueService.deleteVenue(user.id, selectedVenue.venueId);

      await fetchVenuesByVendors(user.id);
      await fetchBlockdatesByVendor(user.id);

      toast({
        title: "Venue deleted",
        description: "Your venue has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeDeleteVenueModal();

    } catch (error) {
      toast({
        title: "Error deleting venue",
        description: "An error occurred while deleting the venue.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Header */}
      <Header></Header>

      {/* Layout */}
      <Grid templateColumns="repeat(8, 1fr)">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <GridItem colSpan={7} bg="#f3f3f3" minH="100vh">
          <Flex justifyContent={'space-between'} alignItems={'center'} pb={5}>
          <Heading as="h2" ml={10} mt={10} fontSize="5xl" color="#7a051d">
            Vendor Dashboard
          </Heading>

          <Button
            mt={10}
            mr={10}
            // ml={6}
            size={'lg'}
            bg="#b6465f"
            color="white"
            _hover={{ bg: "#7a051d" }}
            onClick={openCreateVenue}
          >
            + Create Venue
          </Button>
          </Flex>
          {/* Tabs of all venues */}
          <Tabs size={'lg'} defaultIndex={0} colorScheme="red" >
            <TabList>
              <Tab>Venues</Tab>
              <Tab>Blocked Dates</Tab>
            </TabList>              
          

          {/* Content Area */}
          <TabPanels>

            {/* 1. Venue Tab */}
            <TabPanel>
              <Flex wrap="wrap" p={6}>
                {myVenues.map((venue: Venue) => {
                  const venueApplications = applications.filter(
                    (app) => app.__venue__.venueId === venue.venueId
                  );
                  
                  return (
                    <Card key={venue.venueId} maxWidth={350} m={2}>
                      <VendorVenueCard
                        venue={venue}
                        applicationCount={venueApplications.length} 
                      />

                      <CardFooter pt={2} display="flex" flexDirection="row" justify={'space-between'} alignItems={'center'}>
                        <Text fontSize='xl' color={'gray.600'} fontWeight={'medium'}>${venue.price} / Guests </Text>
                        {/* <Button 
                          color={'white'} 
                          bg={'#EC0520'} 
                          _hover={{ bg: '#d90019'}}
                          fontSize={'lg'}
                          onClick={async () => {
                            setOpenVenue(venue.venueId);
                            await fetchBlockdatesByVenue(venue.venueId); 
                            }}> 
                          Block Venue 
                         </Button> */}
                      </CardFooter>

                      <CardFooter pt={0} display="flex" gap={2} justifyContent="space-between">
                        <Button
                          flex={1}
                          color={'white'} 
                          bg={'#EC0520'} 
                          _hover={{ bg: '#d90019'}}
                          fontSize={'lg'}
                          onClick={async () => {
                            setOpenVenue(venue.venueId);
                            await fetchBlockdatesByVenue(venue.venueId); 
                            }}> 
                          Block Venue 
                        </Button>
                        <Button
                          // flex={1}
                          variant="outline"
                          borderColor="#b6465f"
                          color="#7a051d"
                          _hover={{ bg: "#fbeaec" }}
                          onClick={() => openEditVenueModal(venue)}
                        >
                          <FaRegEdit />
                        </Button>

                        <Button
                          // flex={1}
                          colorScheme="red"
                          variant="outline"
                          onClick={() => openDeleteVenueModal(venue)}
                        >
                          <MdDelete />
                        </Button>
                      </CardFooter>
                    </Card>                      
                  );
                })}
    
                <BlockDatesModal
                  openVenue={openVenue}
                  setOpenVenue={setOpenVenue}
                  selectedRanges={selectedRanges}
                  handleDateChange={handleDateChange}
                  
                />
              </Flex>
            </TabPanel>

            {/* 2. View Blocked Date in Table */}
            <TabPanel>
                <TableContainer>
                  <Table variant='striped' size={'md'} colorScheme={'blackAlpha'}>
                    <Thead>
                      <Tr>
                        <Th>Venue</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {blockDateList}
                    </Tbody>
                  </Table>
                </TableContainer>                
            </TabPanel>
          </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>

      <Modal isOpen={isCreateVenueOpen} onClose={closeCreateVenue}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Venue</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Venue Name</FormLabel>
              <Input
                value={newVenueData.heading}
                onChange={(e) => setNewVenueData({ ...newVenueData, heading: e.target.value })}
                placeholder="Venue Name"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Venue Description</FormLabel>
              <Input
                value={newVenueData.description}
                onChange={(e) => setNewVenueData({ ...newVenueData, description: e.target.value })}
                placeholder="Venue Description"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Price per Guest</FormLabel>
              <Input
                type="number"
                value={newVenueData.price}
                onChange={(e) => setNewVenueData({ ...newVenueData, price: e.target.value })}
                placeholder="Price per Guest"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Guest Capacity</FormLabel>
              <Input
                type="number"
                value={newVenueData.guests}
                onChange={(e) => setNewVenueData({ ...newVenueData, guests: e.target.value })}
                placeholder="Guest Capacity"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Venue Image URL</FormLabel>
              <Input
                value={newVenueData.imgUrl}
                onChange={(e) => setNewVenueData({ ...newVenueData, imgUrl: e.target.value })}
                placeholder="Image URL"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Keywords (comma separated)</FormLabel>
              <Input
                value={newVenueData.keywords}
                onChange={(e) => setNewVenueData({ ...newVenueData, keywords: e.target.value })}
                placeholder="e.g. wedding, outdoor, city view"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                value={newVenueData.location}
                onChange={(e) => setNewVenueData({ ...newVenueData, location: e.target.value })}
                placeholder="Venue Location"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button  mr={3} variant="ghost" onClick={closeCreateVenue}>
                Cancel
            </Button>

            <Button 
              bg="#b6465f"
              color="white"
              _hover={{ bg: "#7a051d" }}
              onClick={handleCreateVenue}>
                Create Venue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditVenueOpen} onClose={closeEditVenueModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Venue</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* Similar form controls as create venue but with editVenueData */}
            {/* ... */}
            <FormControl mb={3} isRequired>
              <FormLabel>Venue Name</FormLabel>
              <Input
                value={editVenueData.heading}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    heading: e.target.value,
                  })
                }
                placeholder="Venue Name"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Venue Description</FormLabel>
              <Input
                value={editVenueData.description}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    description: e.target.value,
                  })
                }
                placeholder="Venue Description"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Price per Guest</FormLabel>
              <Input
                type="number"
                value={editVenueData.price}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    price: e.target.value,
                  })
                }
                placeholder="Price per Guest"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Guest Capacity</FormLabel>
              <Input
                type="number"
                value={editVenueData.guests}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    guests: e.target.value,
                  })
                }
                placeholder="Guest Capacity"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Venue Image URL</FormLabel>
              <Input
                value={editVenueData.imgUrl}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    imgUrl: e.target.value,
                  })
                }
                placeholder="Image URL"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Keywords (comma separated)</FormLabel>
              <Input
                value={editVenueData.keywords}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    keywords: e.target.value,
                  })
                }
                placeholder="e.g. wedding, outdoor, city view"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                value={editVenueData.location}
                onChange={(e) =>
                  setEditVenueData({
                    ...editVenueData,
                    location: e.target.value,
                  })
                }
                placeholder="Venue Location"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button  mr={3} variant="ghost" onClick={closeEditVenueModal}>
                Cancel
            </Button>

            <Button
              bg="#b6465f"
              color="white"
              _hover={{ bg: "#7a051d" }}
              onClick={handleUpdateVenue}
            >
              Saved Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteVenueOpen} onClose={closeDeleteVenueModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Venue</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text>Are you sure you want to delete {" "}
              <strong>{selectedVenue?.heading}</strong>?
            </Text>

            <Text mt={3} color="gray.600">
              This action cannot be undone.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="ghost" onClick={closeDeleteVenueModal}>
              Cancel
            </Button>

            <Button colorScheme="red" onClick={handleDeleteVenue}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export default VendorDashboard;

interface BlockDatesModalProps {
  openVenue: string | null;
  setOpenVenue: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRanges: {
    [venueId: string]: {
      start: Date | null;
      end: Date | null;
    };
  };
  handleDateChange: (
    date: [Date | null, Date | null],
    venueId: string
  ) => Promise<void>;
}

function BlockDatesModal({ openVenue, setOpenVenue, selectedRanges, handleDateChange }: BlockDatesModalProps) {
  
  let range;

  // This make sure when we just open modal 
  // and no date range selected yet (start / end date null)
  // Modal still works and not crashes
  if (openVenue && selectedRanges[openVenue]) {
    range = selectedRanges[openVenue];
  } else {
    range = { start: null, end: null };
  }

  return(
    <>
      <Modal 
        isOpen={openVenue !== null} 
        onClose={() => setOpenVenue(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Blocking Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text>Select a date range to block when venue is unavailable</Text>
          {openVenue && (
            <DatePicker
              wrapperClassName="customDatePickerWidth"
              selected={range.start}
              onChange={(date) => handleDateChange(date, openVenue)}
              startDate={range.start}
              endDate={range.end}
              selectsRange
              dateFormat="MM/dd/yyyy"
              // excludeDateIntervals={disabledRanges}
              customInput={<Input />}
            />
          )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' variant={'outline'} mr={3} onClick={() => setOpenVenue(null)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}