import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Flex, Heading, Box, Button } from '@chakra-ui/react'

import Login from './assets/pages/Login'
import SignUp from './assets/pages/Signup'

import Footer from './assets/components/Footer'
import Header from './assets/components/Header'
import Dashboard from './assets/pages/Dashboard'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Flex direction="column" minHeight="100vh">
        <Header />
        <Box as='main' flex="1" padding={4}>
          <Routes>
            <Route path="/" element={localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
        <Box as='footer' padding={2}>
          <Footer />
        </Box>
      </Flex>
    </BrowserRouter>)
}

export default App