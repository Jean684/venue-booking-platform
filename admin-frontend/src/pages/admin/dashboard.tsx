import { useState } from "react";
import { Grid, GridItem, Heading, Flex, Box, Text, Card, CardFooter, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Input, Tabs, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tbody, Th, Thead, Tr, Td, useToast, FormControl, FormLabel, Textarea, Checkbox, Select } from "@chakra-ui/react";
import Sidebar from "@/components/ui/Sidebar";
import { useEffect } from "react";
import Header from "@/components/ui/Header";
import { User, Venue } from "@/types/types";

import VendorVenueCard from "@/components/features/VendorVenueCard";
import { userService, venueService } from "@/services/api";
import { useRouter } from "next/router";


const VendorDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [openVenue, setOpenVenue] = useState<string | null>(null);
  const [venueList, setVenueList] = useState<Venue[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // This is for setting featured to a venue + swap owner
  const toast = useToast();

  const fetchAllVenues = async () => {
    try {
      const data = await venueService.getAllVenues();
      console.log("fetched venues:", data, Array.isArray(data));
      setVenueList(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      console.log("fetched users:", data, Array.isArray(data));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  useEffect(() => {
    // Simulate fetching user data
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    fetchAllVenues()
    fetchAllUsers()
  }, []);

  const myVenues = venueList;

  const venuesTable = myVenues.map((v, index) => {
    const vendor = users.find((u) => u.id.toLowerCase() === v.vendorId.toLowerCase());

    return (
      <Tr key={index}>
        <Td>{v.heading}</Td>
        <Td>{v.featured ? "Yes" : "No"}</Td>
        <Td>{vendor?.name || vendor?.email}</Td>
        <Td><Button colorScheme='red'variant={'outline'} onClick={() => router.push(`/admin/manage/${v.venueId}`)}>Manage</Button></Td>
      </Tr>
    )
  });
  
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
    vendorId: ""
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
      !newVenueData.keywords.trim() ||
      !newVenueData.vendorId.trim()
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
      await venueService.createVenue({
        vendorId: newVenueData.vendorId,
        heading: newVenueData.heading,
        imgUrl: newVenueData.imgUrl,
        guests: Number(newVenueData.guests),
        location: newVenueData.location,
        price: Number(newVenueData.price),
        description: newVenueData.description,
        keywords: newVenueData.keywords,
      });

      console.log(newVenueData)

      await fetchAllVenues();

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
        vendorId: ""
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
      await venueService.updateVenue( selectedVenue.venueId, {
        heading: editVenueData.heading,
        imgUrl: editVenueData.imgUrl,
        guests: Number(editVenueData.guests),
        location: editVenueData.location,
        price: Number(editVenueData.price),
        description: editVenueData.description,
        keywords: editVenueData.keywords,
      });

      await fetchAllVenues();

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
    if (!selectedVenue) return;

    try {
      await venueService.deleteVenue(selectedVenue.venueId);

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
              bg="#b6465f"
              color="white"
              _hover={{ bg: "#7a051d" }}
              onClick={openCreateVenue}
            >
            Create Venue
          </Button>
          </Flex>
          {/* Tabs of all venues */}
          <Tabs size={'lg'} defaultIndex={0} colorScheme="red" >
            <TabList>
              <Tab>Venues</Tab>
              <Tab>Table</Tab>
            </TabList>              
          

          {/* Content Area */}
          <TabPanels>

            {/* 1. Venue Tab */}
            <TabPanel>
              <Flex wrap="wrap" p={6}>
                {myVenues.map((venue: Venue) => (
                  <Card key={venue.venueId} maxWidth={350} m={2}>
                    <VendorVenueCard
                      venue={venue}
                      featured={venue.featured}
                    />
                    <CardFooter pt={2} display="flex" flexDirection="row" justify={'space-between'} alignItems={'center'}>
                      <Text fontSize='xl' color={'gray.600'} fontWeight={'medium'}>${venue.price} / Guests </Text>
                  
                    </CardFooter>
                    <CardFooter pt={0} display="flex" gap={2} justifyContent="space-between" >
                      <Button
                        flex={1}
                        variant="outline"
                        borderColor="#b6465f"
                        color="#7a051d"
                        _hover={{ bg: "#fbeaec" }}
                        onClick={() => openEditVenueModal(venue)}
                      >
                        Edit
                      </Button>
                      <Button
                        flex={1}
                        colorScheme="red"
                        variant="outline"
                        onClick={() => openDeleteVenueModal(venue)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>                      
                  )
                )}
    
                
              </Flex>
            </TabPanel>

            {/* 2. View Venues in Table */}
            <TabPanel>
              <TableContainer>
                <Table variant='striped' size={'md'} colorScheme={'blackAlpha'}>
                  <Thead>
                    <Tr>
                      <Th>Venue</Th>
                      <Th>Featured</Th>
                      <Th>Owner</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {venuesTable}
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
            <FormControl>
                <FormLabel>Vendor</FormLabel>
                <Select
                  placeholder="Select Vendor"
                  value={newVenueData.vendorId}
                  onChange={(e) => setNewVenueData({ ...newVenueData, vendorId: e.target.value })}
                >
                  {users
                    .filter((u) => u.role.toLowerCase() === "vendor")
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                </Select>
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