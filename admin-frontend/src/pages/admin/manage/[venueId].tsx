import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Box, Button, FormControl, FormLabel, Grid, GridItem, Heading, Radio, RadioGroup, Select, Stack, useToast, VStack, Text } from '@chakra-ui/react';
import { userService, venueService } from '@/services/api';
import { User, Venue } from '@/types/types';
import Footer from '@/components/ui/Footer';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { div } from 'framer-motion/m';
// import { start } from 'repl';

const VenueDetails = () => {
  const router = useRouter();

  const venueId = 
    typeof router.query.venueId === "string"
    ? router.query.venueId
    : null;

  const [ featured, setFeatured ] = useState<boolean>()
  const [ vendor, setVendor ] = useState<string>('');
  const [ users, setUsers] = useState<User[]>([]);
  const [ venue, setVenue] = useState<Venue>()
  const [ venues, setVenues] = useState<Venue[]>([])
  const toast = useToast();

//   const vendor = users.find((u) => u.id.toLowerCase() === v.vendorId.toLowerCase());


  const fetchAllUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAllVenues = async () => {
    try {
      const data = await venueService.getAllVenues();
      setVenues(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchVenue = async () => {
    if (!venueId) return;

    try {
      const data = await venueService.getVenue(venueId);

      if (!data) {
        toast({
          title: "Venue not found",
          description: "The requested venue could not be loaded.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        return;
      }

      console.log("fetched venues:", data);
      console.log("featured value:", data.featured);
      console.log("featured type:", typeof data.featured);
      setVenue(data);
    //   In case we have null values - they are false
      setFeatured(data.featured ?? false);

      if (data?.vendorId) {
        setVendor(data?.vendorId);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  }
  
  useEffect(() => {
    fetchAllUsers()

    if (venueId) {
      fetchVenue()
    }
  }, [venueId]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("featured state:", featured);
      if (!vendor || !venueId) {
        toast({
            title: "Some fields are missing",
            description: "Please fill in all the fields before submitting.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        return;
      }
      
      try {
        // Send both a new vendor and new featured details
        await venueService.assignVendorToVenue(venueId, vendor)
        await venueService.featuredVenue(venueId, featured ?? false);

        toast({
          title: "Success",
          description: "Your venue has been updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });          
      } catch (error) { 
          toast({
            title: "Submission failed",
            description: "Could not submit application.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });            
      }

      await fetchAllVenues()
  };


  return (
    <>
      <Header></Header>
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
            <Heading as={'h2'} ml={6} mt={10} fontSize={'5xl'} color={'#7a051d'}>Venue Details</Heading>

            <Box ml={6} mt={6} display="flex" gap={10} alignItems={'flex-start'}>

              {/* Form on the left */}
              <Box flex="1" justifyContent="center">

                <form onSubmit={handleSubmit}>
                    <Box maxW="700px" mx="auto" mt={6}>
                        <VStack spacing={5} align="stretch">
                        <FormLabel mb={0}>Venue</FormLabel>
                        <Text pt={0} mt={0}>{venue?.heading}</Text>

                        <FormControl>
                            <FormLabel>Vendor</FormLabel>
                            <Select
                              placeholder="Select Vendor"
                              value={vendor}
                              onChange={(e) => setVendor(e.target.value)}
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

                        <FormControl>
                            <FormLabel>Featured on main page</FormLabel> 
                            <RadioGroup
                              value={featured ? "true" : "false"}
                              onChange={(value) => setFeatured(value === "true")}
                            >
                              <Stack direction="row">
                                <Radio value="true">Yes</Radio>
                                <Radio value="false">No</Radio>
                              </Stack>
                            </RadioGroup>                            
                        </FormControl>

                    <Button type="submit" variant="outline" colorScheme="red" mt={4} width="100%">
                        Submit
                    </Button>
                    </VStack>
                    </Box>
                </form>

              </Box>
            </Box>
        </GridItem>
      </Grid>
      <Footer></Footer>    
    </>
  )
}

export default VenueDetails;

