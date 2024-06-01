import { useEffect } from 'react'
import AppRoutes from './AppRoutes'
import { useColorMode, Button } from '@chakra-ui/react'
import Header from './components/Header/Header'

function App() {
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', colorMode)
  }, [colorMode])

  return (
    <>
      <Header />
      <Button style={{ position: "fixed", bottom: "2%", right: "2%" }} onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
      <AppRoutes />
    </>
  )
}

export default App
