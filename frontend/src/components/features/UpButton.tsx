import { Button } from '@chakra-ui/react'
import { FaAngleUp } from "react-icons/fa";

function UpButton({ onClick = () => {}}) {
  return (
    <Button
        bg={'blackAlpha.200'}
        borderColor={'blackAlpha.200'}
        _hover={{ bg: 'blackAlpha.300'}}
        onClick={onClick}>
        <FaAngleUp />
    </Button>
  )
}

export default UpButton
