import React, { use, useEffect, useState } from 'react'
import { Grid, Button, ButtonGroup, GridItem, Heading } from "@chakra-ui/react"
import Header from "@/components/ui/Header";
import Sidebar from '@/components/ui/Sidebar';
import { div } from 'framer-motion/client';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { mockVenues, mockedSavedVenues } from '@/types/data';
import UpButton from '@/components/features/UpButton';
import DownButton from '@/components/features/DownButton';
import Footer from '@/components/ui/Footer';
import { useSavedVenue } from '@/context/SavedVenueContext';
import { useRouter } from 'next/router';
import { User, Venue } from '@/types/types';
import { venueService } from '@/services/api';


function SavedVenues( ) {
  // const [savedIds, setSavedIds] = usePersistedState<string[]>("savedVenues", [])
  const { savedIds, setSavedIds } = useSavedVenue();
  const [ venues, setVenues] = useState<Venue[]>([])

  // console.log("savedIds:", savedIds);
  // console.log("mockVenues ids:", mockVenues.map(v => v.id));

  // React ToDo List - swapping between indexes
  // Source: https://www.youtube.com/watch?v=9wiWzu_tRB0

  const fetchVenues = async () => {
    try {
      const data = await venueService.getAllVenues();
      setVenues(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const moveVenueUp = (index: number) => {
    if(index > 0) {
      const updatedVenues = [...savedIds];      
      [updatedVenues[index], updatedVenues[index - 1]] = 
      [updatedVenues[index - 1], updatedVenues[index]]

      // Set the new index
      setSavedIds(updatedVenues)
    }
  }

  const moveVenueDown = (index: number) => {
    console.log(savedIds.length)
    if(index < savedIds.length - 1) {
      const updatedVenues = [...savedIds];
      [updatedVenues[index], updatedVenues[index + 1]] = 
      [updatedVenues[index + 1], updatedVenues[index]]
      setSavedIds(updatedVenues)
    }
  }

  const router = useRouter()
  const handleApply = (venueId: string) => {
    router.push(`create-event/${venueId}`)
  }

  // Keep a list of saved venues
  const savedList = savedIds?.map((id, index) => {
    const venue = venues.find(v => v.venueId === id);
    // Find matching venues by comparing mockVenues.id(v.id) with savedIds.id(id)

    if (!venue) return null ;

    return (
    <Tr key={venue.venueId}>
      <Td>{venue.heading}</Td>
      <Td>{venue.location}</Td>
      <Td isNumeric>${venue.price}</Td>
      <Td isNumeric>{venue.guests}</Td>
      <Td>
        <ButtonGroup>
          <UpButton onClick={() => moveVenueUp(index)}></UpButton>
          <DownButton onClick={() => moveVenueDown(index)}></DownButton>
          <Button colorScheme='red'variant={'outline'} onClick={() => handleApply(venue.venueId)}>Apply</Button>
        </ButtonGroup>
      </Td>     
    </Tr>
    );
  });

  return (
    <>
      {/* Whole page follows 8 columns layout */}
      <Header></Header>
      
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
            <Heading as={'h2'} ml={6} mt={10} mb={10} fontSize={'5xl'} color={'#7a051d'}>Saved Venues</Heading>
            
            {/* Table of saved venues */}
            <TableContainer>
              <Table variant='striped' size={'md'} colorScheme={'blackAlpha'}>
                <Thead>
                  <Tr>
                    <Th>Venue Name</Th>
                    <Th>Location</Th>
                    <Th isNumeric>Price Per Guests</Th>
                    <Th isNumeric>Capacity</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {savedList}
                </Tbody>
              </Table>
            </TableContainer>                        
        </GridItem>
      </Grid>
      <Footer></Footer>

    </>
  )
}
export default SavedVenues
