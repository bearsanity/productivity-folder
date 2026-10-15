import { NavLink } from "react-router-dom";
import { Box, Button, Flex } from '@chakra-ui/react'

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

function Nav() {
    const isLoggedIn = localStorage.getItem('token');

    return (
        <Box as="nav">
            {isLoggedIn ? (
                <Flex gap={4}>
                    {/* <NavLink to="/">Home</NavLink> */}
                    <Button  paddingRight={8} variant="ghost" borderRadius="md" onClick={handleLogout}>Logout</Button>
                </Flex>
            ) : (
                <Flex gap={4} display="flex" justifyContent="center" alignItems="center">
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/signup">Sign Up</NavLink>
                </Flex>
            )}
        </Box>
    );
};

export default Nav;