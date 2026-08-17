'use server';
import React from 'react'
import { Box, Button, ButtonGroup, Center, Container, Flex, FormLabel, Grid, GridItem, Heading, Input, Text } from "@chakra-ui/react"
import Header from "@/components/ui/Header";
import Sidebar from '@/components/ui/Sidebar';
import { div } from 'framer-motion/client';
import Footer from '@/components/ui/Footer';
import ApplicationForm from '@/components/features/ApplicationForm';
import { useRouter } from 'next/router';

export default function CreateEvent() {
  const router = useRouter()
  const venueId = router.query;

  return (
    <>
      {/* Whole page follows 8 columns layout */}
      <Header></Header>
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
            <Heading as={'h2'} ml={6} mt={10} fontSize={'5xl'} color={'#7a051d'}>Application for Venue</Heading>

            <Box ml={6} mt={6} display="flex" gap={10} alignItems={'flex-start'}>

              {/* Form on the left */}
              <Box flex="1" justifyContent="center">
                <ApplicationForm venueId = {venueId}/>
              </Box>

              {/* Image on the right - NOT NEEDED*/} 
              {/*<Box flex="2" display="flex" justifyContent="center">
                <Box
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  p={6}
                  w="100%"
                  maxW="400px"
                  minH="300px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="lg" fontWeight="semibold" color="gray.500">
                    Event Details
                  </Text>
                </Box>
              </Box> */}

            </Box>
        </GridItem>
      </Grid>
      <Footer></Footer>
    </>
  )
}


