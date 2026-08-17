import { Box, GridItem } from '@chakra-ui/react'
import React from 'react'

export default function Footer() {
  return (
   
    <GridItem 
        as='footer'
        bg={'white'}
        textAlign={'center'}
        // position={'fixed'}
        minWidth={'100vw'}
        bottom={0}
        padding={'4'}
        boxShadow={'lg'}
    >
      Made with love - Full Stack Dev S1 2026
    
    </GridItem>

  )
}
