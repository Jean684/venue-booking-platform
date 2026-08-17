import { Flex, Heading, Input, Image, Button, Icon,  } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdLogout } from "react-icons/md";

import { useRouter } from 'next/router';

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

function HeaderSearch({ search, setSearch }: HeaderProps) {

  const router = useRouter(); 
  
  function handleLogout() {
    // Clear user session (this is just a placeholder, implement your actual logout logic here)
    localStorage.removeItem("currentUser");
    // Redirect to sign-in page
    router.push("/signin");
  }

  return (
    <Flex 
      justifyContent={'space-between'}
      alignItems={'center'}
      p={3}
      pl={6}
      gap={4}
      bg={'white'}
      boxShadow={'base'}
      >
        <Heading color={'#7a051d'}>Home</Heading>

        {/* Search bar */}
        
          <Input
              bg={'#ececec'}
              focusBorderColor='#7a051d'
              placeholder='Search for bar, restaurant...'
              size={'lg'}
              width={'600px'}
              p={4}
              value={search}
              onChange={(e) => setSearch(e.target.value)}>                     
          </Input>
        
        {/* Groups of avatar image + log out button? */}
        <Flex gap={6} justifyContent={'center'} alignItems={'center'}>
          <Button 
            fontSize={'lg'} 
            bg={'#7a051d'} 
            color={'white'} 
            _hover={{ bg: '#7a051cc7'}} 
            gap={2} 
            justifyContent={'center'}
            mr={8} 
            onClick={handleLogout}>
            Log Out
            <Icon fontSize={'2xl'} >
              <MdLogout />
            </Icon>
          </Button>
        </Flex>
    </Flex>    
  )
}

export default HeaderSearch
