import { Card, CardBody, CardFooter, Heading, Image, Stack, Text, Button, Box, Badge, Flex, Tooltip } from "@chakra-ui/react";
import { Venue } from "@/types/types";
import { h3 } from "framer-motion/m";


interface VendorVenueCardProps {
    venue: Venue;
    applicationCount: number;
}

export default function VendorVenueCard({ venue, applicationCount }: VendorVenueCardProps) {

    return (
    <>
      {/* Card width should always be the same as image width */}
      {/* <Card maxWidth={350} m={8}> */}
      <Box>
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
                  <Badge variant={'subtle'} colorScheme="red" textTransform={'uppercase'}>
                    {applicationCount} apps
                  </Badge>
                  
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