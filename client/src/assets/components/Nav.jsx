import { NavLink } from "react-router-dom";
import { Box, Button } from '@chakra-ui/react'

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

function Nav() {
    const isLoggedIn = localStorage.getItem('token');

    return (
        <Box as="nav">
            {isLoggedIn ? (
                <>
                    <NavLink to="/">Home</NavLink>
                    <Button onClick={handleLogout}>Logout</Button>
                </>
            ) : (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/signup">Sign Up</NavLink>
                </>
            )}
        </Box>
    );
};

export default Nav;