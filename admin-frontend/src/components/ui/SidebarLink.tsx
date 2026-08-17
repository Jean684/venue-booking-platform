import { Link, ListItem, Box, Flex, Text, Icon } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { IconType } from 'react-icons';

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: IconType;
}

function SidebarLink({ href, label, icon}: SidebarLinkProps) {
  const router = useRouter();

  return (
    <ListItem>
        <Link onClick={() => router.push(href)}
            color={'#7a051d'} 
            _activeLink={{ bg: "#7a051d", color: 'white', fontWeight: 'bold'}}
            _hover={{ bg: "#7a051d", color: 'white', fontWeight: 'bold' }}
            display={'block'}
            m={2}
            borderRadius={'md'}
            p={4}
        >
            <Flex gap={4} alignItems={'center'}>
                <Icon as={icon} fontSize={'2xl'} ></Icon>
                <Text fontSize={'xl'} fontWeight={'medium'}>{label}</Text>
            </Flex>
        </Link>
    </ListItem>
  )
}

export default SidebarLink
