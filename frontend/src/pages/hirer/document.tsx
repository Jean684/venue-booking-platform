import React, { useEffect, useState } from 'react'
import { Checkbox, CheckboxGroup, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react"
import Header from "@/components/ui/Header";
import Sidebar from '@/components/ui/Sidebar';
import { div } from 'framer-motion/client';
import Footer from '@/components/ui/Footer';
import { mockUsers } from '@/types/data';
import { User, Hirer, Vendor } from '@/types/types';
import { UserService } from '@/services/api';

function Document( ) {
  const [values, setValues] = useState<(string)[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect (() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      const currentUserObject = JSON.parse(currentUser)
      setCurrentUser(currentUserObject);

      if (currentUser) {
        // setValues(currentUserObject.document || [])
        setValues(
        currentUserObject.documents
          ? currentUserObject.documents.split(",")
          : []
      );
      }
    }
  }, [])

  const handleChange = async (newValues: string[]) => {
    setValues(newValues)

    if (!currentUser) return;

    const updatedUser = {...currentUser,
      documents: newValues.join(",")
    }

    // Refer to profile page for explanation
    // const userList = localStorage.getItem("users")
    // const userListObject = userList ? JSON.parse(userList) : []

    // const updatedUserList = userListObject?.map((user: User) => 
    //   user.id === currentUser?.id ? updatedUser : user
    // )

    console.log("Sending:", newValues.join(","));
    const updatedDocuments = await UserService.updateDocument (
      currentUser.id, { documents: newValues.join(",") }
    );

    // localStorage.setItem("users", JSON.stringify(updatedUserList));
    setCurrentUser(updatedUser)
    // localStorage.setItem("currentUser", JSON.stringify(updatedUser));    
  }

  // Calculate the score
  // Default is 0
  const score = values?.reduce((total, v) => {
    if (v === "driver")   { return total + 2 } 
    if (v === "currency") { return total + 1 } 
    if (v === "business") { return total + 2 }
    return total;
  }, 0)

  return (
    <>
      {/* Whole page follows 8 columns layout */}
      
      <Header></Header>
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
            <Heading as={'h2'} ml={6} mt={10} fontSize={'5xl'} color={'#7a051d'}>Identity Document</Heading>
              <CheckboxGroup colorScheme='green' defaultValue={[]} value={values} onChange={handleChange} >
               
                <Flex mt={10} gap={4} direction={'column'} justify={'center'} align={'center'}>
                  {/* 2 points */}
                  <Checkbox value='driver'>
                    <Text fontSize={'xl'}>Driver’s License (2 points)</Text>
                  </Checkbox>

                  {/* 1 points */}
                  <Checkbox value='currency'>
                    <Text fontSize={'xl'}>Certificate of Currency (1 point)</Text>
                  </Checkbox>
                  
                  {/* 2 points */}
                  <Checkbox value='business'>
                    <Text fontSize={'xl'}>Business Register (2 points)</Text>
                  </Checkbox>
                  <Text fontSize={'xl'} fontWeight={'medium'}>Identity Score: {score} / 5</Text>
                </Flex>
                
              </CheckboxGroup>
        </GridItem>
      </Grid>
      <Footer></Footer>
    </>
  )
}

export default Document
