import { Geist, Geist_Mono } from "next/font/google";
import {  Flex, Grid, GridItem, Heading } from "@chakra-ui/react"
import Sidebar from "@/components/ui/Sidebar";
import { div } from "framer-motion/client";
import VenueList from "@/components/features/VenueList";
import Footer from "@/components/ui/Footer";
import { useEffect, useState } from "react";
import HeaderSearch from "@/components/ui/HeaderSearch";

import { useRouter } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [search, setSearch] = useState<string>('')

  return (
    <>
      {/* Whole page follows 8 columns layout */}
     
      <HeaderSearch search={search} setSearch={setSearch}></HeaderSearch>
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
          <Heading as={'h2'} ml={6} mt={10} fontSize={'5xl'} color={'#7a051d'}>Dashboard</Heading>
          <Flex wrap={'wrap'}>
            <VenueList search={search}></VenueList>
          </Flex>

          {/* <Footer></Footer> */}
        </GridItem>
        
      </Grid>
      <Footer></Footer>
      
    </>
  );
}
