  import { Button, Text, Card, CardBody, CardFooter, Heading, Stack, Image, Flex, Badge, Tooltip, Box } from '@chakra-ui/react'
  import { h3 } from 'framer-motion/client'
  import React, { useEffect, useState } from 'react';
  import { Venue } from '@/types/types'
  import { mockedSavedVenues, mockNoVenues, mockVenues } from '@/types/data';
  import { setItem } from '@/utils/localStorage';
  import { useSavedVenue } from '@/context/SavedVenueContext';
  import { venueService } from '@/services/api';

  interface VenueCardProps {
    venue: Venue;
  }

  interface VenueListProps {
    search: string;
  }

  function VenueCard({ venue }: VenueCardProps) {
    const { addVenueToWishlist } = useSavedVenue()

    return (
      <>
        {/* Card width should always be the same as image width */}
        <Card maxWidth={350} m={8}>
            {/* <Image 
                src={venue.imgUrl || "/placeholder.jpg"}
                alt={venue.heading}
                w={350}>  
            </Image> */}
            <Box position="relative">
              <Image
                src={venue.imgUrl || "/placeholder.jpg"}
                alt={venue.heading}
                w={350}
              />
            
              {venue.featured && (
                <Tooltip
                  bg="red.500"
                  color={'white'}
                  label="Highlighted for quality and popularity"
                >
                  <Badge
                    variant={'solid'}
                    position="absolute"
                    top={3}
                    right={3}
                    colorScheme="red"
                    px={2}
                    py={1}
                    borderRadius="base"
                    fontSize="0.8em"
                  >
                    Featured
                  </Badge>
                </Tooltip>
              )}
            </Box>

            {/* Stack = container for heading + text */}
            <Stack spacing={3}>                
                <CardBody>
                  <Flex justify={'flex-start'} align={'center'} gap={3}>
                  <Text 
                    color='red.400'
                    fontWeight='bold'
                    letterSpacing='wide'
                    fontSize='sm'
                    textTransform='uppercase'
                    pb={1}                  
                  >{venue.guests} guests | {venue.location}
                  </Text>
                  {/* <Tooltip bg={'red.500'} label="Highlighted for quality and popularity" >
                    <Badge variant={'subtle'} colorScheme="red" textTransform={'uppercase'}>
                      {venue.featured ? "Featured" : ""}
                    </Badge>
                  </Tooltip> */}
                  </Flex>
                  <Heading as={h3} size={'lg'}>
                    {venue.heading}
                  </Heading>
                  
                  <Text noOfLines={3}>
                    {venue.description}
                  </Text>
                  
                </CardBody>
            </Stack>
                
            {/* Contains a group of buttons */}            
            <CardFooter pt={2} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize='2xl' color={'gray.600'} fontWeight={'medium'}>${venue.price} / Guests </Text>
                <Button 
                    color={'white'} 
                    bg={'#EC0520'} 
                    _hover={{ bg: '#d90019'}}
                    fontSize={'lg'}
                    onClick={() => addVenueToWishlist(venue.venueId)}>
                    Wishlist +
                </Button>
            </CardFooter>
            {/* <Text>{venue.keywords}</Text> */}
        </Card>
      </>
    )
  }


  export default function VenueList ({ search }: VenueListProps) {
    const [venues, setVenues] = useState<Venue[]>([]);
    // Link: https://www.youtube.com/watch?v=MY6ZZIn93V8
    // Instead of venue.heading || venue.guests etc --> use keys to search multiple

    const fetchVenues = async () => {
      try {
        const data = await venueService.getAllVenues();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    
    const fetchSearch = async (q: string) => {
      try {
        const data = await venueService.searchVenues(search)
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };    
    
    useEffect(() => {
      if (search.trim().toLowerCase()) {
        fetchSearch(search);
      } else {
        fetchVenues();
      }
    }, [search]);


    // If no results then displays this
    if (venues.length === 0) {
      return (
        <Flex mt={10} justify={'center'} w={'100%'}>
          <Text fontSize={'3xl'} fontWeight={'medium'} color={'gray.600'}>
            Sorry, no venues were found
          </Text>
        </Flex>
      )
    }

    return (
      <>
        {venues.map((venue) => (
          <VenueCard key={venue.venueId} venue={venue} />
        ))}
      </>
    )
  }

