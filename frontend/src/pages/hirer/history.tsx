import React, { useEffect, useState } from 'react'
import { Grid, GridItem, Heading, Input, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Header from "@/components/ui/Header";
import Sidebar from '@/components/ui/Sidebar';
import { div } from 'framer-motion/client';
import Footer from '@/components/ui/Footer';
import { Application, User, Venue } from '@/types/types';
import { applicationService, venueService } from '@/services/api';

function History( ) {
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);
  const [ applications, setApplications] = useState<Application[]>([])

  const fetchApplicationByHirer = async () => {
    if (!currentUser) return;
    
    try {
      const data = await applicationService.getAllApplicationByUser(currentUser.id);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect (() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      const currentUserObject = JSON.parse(currentUser)
      setCurrentUser(currentUserObject);
    }
  }, [])

  useEffect(() => {
   if (currentUser) {
     fetchApplicationByHirer();
   }
  }, [currentUser]);


  const hiringHistoryList = applications
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

  return (
    <>
      {/* Whole page follows 8 columns layout */}
      <Header></Header>
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
            <Heading as={'h2'} ml={6} mt={10} mb={10} fontSize={'5xl'} color={'#7a051d'}>Venues History</Heading>

            {/* Table of hired venues */}
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
        </GridItem>
      </Grid>
      <Footer></Footer>
    </>
  )
}

export default History
