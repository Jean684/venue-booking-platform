import { Card, CardBody, CardFooter, Heading, Image, Stack, Text, Button, Box, Badge, Flex, Tooltip } from "@chakra-ui/react";
import { Venue } from "@/types/types";
import { h3 } from "framer-motion/m";


interface VendorVenueCardProps {
  venue: Venue;
  featured: boolean;
}

export default function VendorVenueCard({ venue, featured }: VendorVenueCardProps) {

    return (
    <>
      {/* Card width should always be the same as image width */}
      {/* <Card maxWidth={350} m={8}> */}
      <Box>
        <Box position="relative">
          <Image
            src={venue.imgUrl || "https://img.magnific.com/free-vector/illustration-gallery-icon_53876-27002.jpg"}
            alt={venue.heading}
            w={350}
          />
        
          {venue.featured && (
            <Tooltip
              bg="red.500"
              color={'white'}
              label="This venue is highlighted on the homepage and in featured venue listings."
            >
              <Badge
                variant={'solid'}
                position="absolute"
                top={3}
                right={3}
                colorScheme="red"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="0.8em"
              >
                Featured
              </Badge>
            </Tooltip>
          )}
        </Box>        
          {/* <Image 
              src={venue.imgUrl || "/my-app/public/placeholder.jpg"}
              alt={venue.heading}
              w={350}>  
          </Image> */}
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
                </Flex>
                <Heading as={h3} size={'lg'}>
                  {venue.heading}
                </Heading>
                
                <Text noOfLines={3}>
                  {venue.description}
                </Text>
              </CardBody>
          </Stack>
        </Box>
    </>
  );
}