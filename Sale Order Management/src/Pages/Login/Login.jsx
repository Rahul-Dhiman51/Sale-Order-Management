import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, VStack, Text, Heading, Flex } from '@chakra-ui/react'
import classes from './login.module.css'

const Login = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate()
    const { user, login } = useAuth()

    const [params] = useSearchParams()
    const returnUrl = params.get('returnUrl')

    useEffect(() => {
        if (!user) return;

        returnUrl ? navigate(returnUrl) : navigate('/')
    }, [user, navigate, returnUrl]);

    const submit = async ({ email, password }) => {
        await login(email, password)
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.details}>
                <Flex direction="column" alignItems="center" mb={6}>
                    <Heading as="h1" size="xl">Login</Heading>
                </Flex>
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <VStack spacing={4}>
                        <FormControl isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                                        message: 'Email is not valid',
                                    }
                                })}
                            />
                            <FormErrorMessage>
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                })}
                            />
                            <FormErrorMessage>
                                {errors.password && errors.password.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button type="submit" colorScheme="blue">Login</Button>

                        <Text className={classes.register}>
                            New User? &nbsp; Register
                        </Text>
                    </VStack>
                </form>
            </Box>
        </Box>
    )
}

export default Login
