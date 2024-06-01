import React from 'react'
import { Box, Flex, Heading, Button, useColorModeValue } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'

const Header = () => {
    const { user, logout } = useAuth()

    const bgColor = useColorModeValue('gray.100', 'gray.700')
    const textColor = useColorModeValue('black', 'white')

    return (
        <Box bg={bgColor} p={4} boxShadow="md">
            <Flex justify="space-between" align="center">
                <Heading as="h1" size="lg" color={textColor}>Sales Order Management</Heading>
                <Flex align="center">
                    {user && <Button colorScheme="red" onClick={logout}>Logout</Button>}
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header
