import Nav from "./Nav";
import { Box, Heading, Flex } from '@chakra-ui/react'

function Header() {
    return (
        <Flex as="header" justifyContent="space-between" paddingLeft={4}>
            <Heading paddingTop={4}>Productivity <span>Board</span></Heading>
            <Nav />
        </Flex>
    );
}

export default Header;