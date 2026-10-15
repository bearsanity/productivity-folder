import Nav from "./Nav";
import { Box, Heading, Flex } from '@chakra-ui/react'

function Header() {
    return (
        <Flex as="header" alignItems="center" justifyContent="space-between" padding={4} backgroundColor="#ffffff">
            <Heading fontStyle="italic" fontSize="150%" justifyContent="center" alignItems="center">Productivity <span>Folder</span></Heading>
            <Nav />
        </Flex>
    );
}

export default Header;