//import React from 'react'
import React, { useEffect, useState } from 'react'
import {Input, Button, FormControl, FormLabel, VStack, Box} from '@chakra-ui/react'
import { useToast } from "@chakra-ui/react"
import { ParsedUrlQuery } from 'querystring';
import { Blockdate, User, Venue } from '@/types/types';
import { mockVenues } from '@/types/data';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import globals from "@/styles/globals.css"
import { applicationService, blockdateService } from '@/services/api';

export default function ApplicationForm({ venueId }: {venueId: ParsedUrlQuery}) {
    const [eventName, setEventName] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);
    const [start, end] = selectedRange; 
    const [blockdates, setBlockdates] = useState<Blockdate[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [venueList, setVenueList] = useState<Venue[]>([]);

    const toast = useToast();

    // Force parsing
    const parseLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day); // local date
    };

    const fetchBlockdatesByVenue = async (venueId: string) => {
      try {
        const data = await blockdateService.getBlockdatesByVenue(venueId);
        setBlockdates(data);
      } catch (error) {
        console.error("Error fetching venue blockdates:", error);
      }
    };
    

    // Fetch all venues
    useEffect(() => {
      let storedVenues = localStorage.getItem("venues");
    
      if (!storedVenues) {
        localStorage.setItem("venues", JSON.stringify(mockVenues));
        storedVenues = JSON.stringify(mockVenues);
      }

      setVenueList(JSON.parse(storedVenues));
    }, []);

    useEffect(() => {
      if (!venueId?.venueId) return;

      fetchBlockdatesByVenue(String(venueId.venueId));
    }, [venueId])

    // Fetch current users
    useEffect(() => {
      const currentUser = localStorage.getItem("currentUser");  
      if (currentUser) {
        const currentUserObject = JSON.parse(currentUser)
        setCurrentUser(currentUserObject);
      }
    }, []);


    const selectedVenue = venueList.find(
        v => v.venueId === String(venueId.venueId)
    );

    //  Convert disabled date ranges from venues to DatePicker
    // const excludedRanges =
    //   selectedVenue?.disableDateRange?.map(range => ({
    //     start: parseLocalDate(range.start),
    //     end: parseLocalDate(range.end),
    //   })) || [];

    const excludedRanges = blockdates.map(b => ({
      start: parseLocalDate(b.startDate),
      end: parseLocalDate(b.endDate),
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //In the meantime, we can just log the form data to the console to verify it's working
        //console.log("Form submitted", { eventName, guestCount, date, time, duration, venueId });
        // Here you would typically send the form data to your backend API

        // Check for overlapping dates
        // Note: selected range with same start/end day in disableDateRange
        //  would still count as overlap
        if (!eventName || !guestCount || !start || !end) {
            toast({
                title: "Some fields are missing",
                description: "Please fill in all the fields before submitting.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const hasOverlap = blockdates.some(b => {
          const rangeStart = parseLocalDate(b.startDate);
          const rangeEnd = parseLocalDate(b.endDate);

          return (
            start <= rangeEnd &&
            end >= rangeStart
          );
        });

        // Send error toast
        if (hasOverlap) {   
          toast({
            title: "Date unavailable for this venue",
            description: "Please try again with another date",
            status: "error",
            duration: 5000,
          });
          return;
        }
        
        const newApplication = {
            // applicationId: crypto.randomUUID(),
            // userId here actually means hirerId, but name is changed to match DB
            userId: currentUser?.id,
            eventName,
            guestCount: Number(guestCount),
            startDate: start.toLocaleDateString("en-CA"),
            endDate: end.toLocaleDateString("en-CA"),
            venueId: venueId.venueId,
            status: "Pending" // default status
        };

        try {
            await applicationService.createApplication(newApplication)
            toast({
              title: "Application submitted",
              description: "Your application has been submitted successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });

            // Reset form fields after submission
            setEventName('');
            setGuestCount('');
            setSelectedRange([null, null]);            
        } catch (error) { 
            toast({
              title: "Submission failed",
              description: "Could not submit application.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });            
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <Box maxW="700px" mx="auto" mt={6}>
                <VStack spacing={5} align="stretch">
        
                <FormControl>
                    <FormLabel>Event Name</FormLabel> 
                    <Input
                        placeholder="Enter your event name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Number of Guests</FormLabel>
                    <Input
                        type="number"
                        placeholder='How many guests will there be?'
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                    />
                </FormControl>

                {/* Bug: https://stackoverflow.com/questions/51710700/react-datepicker-input-width-will-not-adjust-to-100 */}
                <FormControl>
                    <FormLabel>Date of Event (MM/DD/YYYY)</FormLabel>             
                    <DatePicker wrapperClassName="customDatePickerWidth"               
                      selectsRange
                      startDate={start}
                      endDate={end}
                      onChange={(update) => setSelectedRange(update)}
                      excludeDateIntervals={excludedRanges}
                      customInput={<Input />}
                    />   
                </FormControl>

            <Button type="submit" variant="outline" colorScheme="red" mt={4} width="100%">
                Submit Application
            </Button>
            </VStack>
            </Box>
        </form>
    );
}

