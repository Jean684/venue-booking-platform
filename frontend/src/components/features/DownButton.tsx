import { Button } from '@chakra-ui/react'
import React from 'react'
import { FaAngleDown } from "react-icons/fa";

function DownButton({ onClick = () => {}}) {
  return (
    <Button
        bg={'blackAlpha.200'}
        borderColor={'blackAlpha.200'}
        _hover={{ bg: 'blackAlpha.300'}}
        onClick={onClick}>
        <FaAngleDown />
    </Button>
  )
}

export default DownButton
