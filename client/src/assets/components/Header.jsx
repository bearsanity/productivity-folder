import Nav from "./Nav";
import { Box, Heading } from '@chakra-ui/react'

function Header() {
    return (
        <Box as="header">
            <Heading paddingTop={4}>Productivity <span>Board</span></Heading>
            <Nav />
        </Box>
    );
}

export default Header;