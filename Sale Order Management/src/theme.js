// theme.js

// 1. import `extendTheme` function
import { chakra, extendTheme } from '@chakra-ui/react'
const savedTheme = localStorage.getItem('chakra-ui-color-mode')

// 2. Add your color mode config
const config = {
    initialColorMode: savedTheme || 'light',
    useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme