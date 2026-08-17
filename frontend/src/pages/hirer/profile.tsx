import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Container, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Input, Text, useToast } from "@chakra-ui/react"
import Header from "@/components/ui/Header";
import Sidebar from '@/components/ui/Sidebar';
import { div } from 'framer-motion/client';
//import { mockUsers } from '@/types/data'; 
import Footer from '@/components/ui/Footer';
//import { useRouter } from 'next/router';
import { User } from '@/types/types';
import { UserService } from '@/services/api';

function Profile() {
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const toast = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      const currentUserObject = JSON.parse(currentUser)
      setCurrentUser(currentUserObject);

      setName(currentUserObject.name || '');
      setPhone(currentUserObject.phone || '');
    }
  }, []);

  const handleSave = async () => {
    if (!currentUser) return;

    if (!validateName(name)) return ;
    if (!validatePhone(phone)) return ;

    const updatedUser = {...currentUser, 
      name: name, 
      phone: phone
    }

    // Problem: to sync between current user and other users in localStorage
    // We need to add what we change (updatedUser) into the list containing other users as well
    // Get all users
    const userList = localStorage.getItem("users")
    const userListObject = userList ? JSON.parse(userList) : []

    // Find matching users before updating
    // If matching, we return the updated user into the updated user list
    const updatedUserList = userListObject?.map((user: User) => 
      user.id === currentUser?.id ? updatedUser : user
    )

    const savedUser = await UserService.updateUser( 
      currentUser.id, { name, phone,}
    )
    // Update into the list of all users in localStorage
    localStorage.setItem("users", JSON.stringify(updatedUserList));

    setCurrentUser(savedUser)
    localStorage.setItem("currentUser", JSON.stringify(savedUser));

    toast({
      title: "Success!",
      description: "Your profile has been updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phone) {
      toast ({
        title: "Missing phone number",
        description: "Please fill in the phone number",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false      
    }

    if (!phoneRegex.test(phone)) {
      toast ({
        title: "Wrong phone format",
        description: "Please use number for your phone number",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false
    }
    
    return true;
  }

  const validateName = (name: string) => {
    const nameRegex = /^[a-z ,.'-]+$/i

    if (!name) {
      toast ({
        title: "Missing name",
        description: "Please fill in the name",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false      
    }    

    if (!nameRegex.test(name)) {
      toast ({
        title: "Wrong name format",
        description: "Please enter a proper name",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false
    }
    return true;
  }

  const formatDateJoined = currentUser?.dateJoined ? new Date(currentUser.dateJoined).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
  })
  : "N/A";

  const demoUsers = currentUser && (
      <Flex key={currentUser.id}  
        flexDir={'column'} 
        m={10}
      >
        
      {/* Email */}
      <FormControl pb={8}>
        <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Email</FormLabel>
        <Text fontSize={'lg'}>{currentUser.email}</Text>
      </FormControl>

      {/* Password */}
      {/* <FormControl pb={8}>
        <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Password</FormLabel>
        <Text fontSize={'lg'}>{currentUser.password}</Text>
      </FormControl> */}

      {/* Name */}
      <FormControl isRequired pb={8}>
        <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Name</FormLabel>
        <Input type='text'
          placeholder='Mary Sue'
          value={name}
          onChange={(e) => setName(e.target.value)}>
        </Input>
      </FormControl>

      {/* Phone */}
      <FormControl isRequired pb={8}>
        <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Phone</FormLabel>
        <Input type='tel'
          maxLength={10}
          placeholder='Phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}>
        </Input>
      </FormControl>

      {/* Date joined */}
      <FormControl pb={8}>
        <FormLabel fontSize={'lg'} textTransform={'capitalize'}>Date Joined</FormLabel>
        <Text fontSize={'lg'}>{formatDateJoined}</Text>
      </FormControl>

      <Button variant={'outline'} colorScheme={'red'} flexGrow={1} size={'lg'} onClick={handleSave}>Save</Button>
      </Flex>
    )
  
  return (
    <>
      {/* Whole page follows 8 columns layout */}
      <Header></Header>
      <Grid 
        templateColumns="repeat(8, 1fr)">
        <Sidebar></Sidebar>
        
        {/* Main section div */}
        <GridItem as={div} colSpan={7} bg="#f3f3f3" >
            <Heading as={'h2'} ml={6} mt={10} fontSize={'5xl'} color={'#7a051d'}>Profile</Heading>
            <Container>
                {demoUsers}
            </Container>
        </GridItem>
      </Grid>
      <Footer></Footer>
    </>
  )
}

export default Profile

