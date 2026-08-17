import Nav from "./Nav";
import { Box, Heading } from '@chakra-ui/react'

function Header() {
    return (
        <Box as="header">
            <Heading>Productivity <span>Board</span></Heading>
            <Nav />
        </Box>
    );
}

export default Header;