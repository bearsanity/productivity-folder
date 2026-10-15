import Nav from "./Nav";
import { Box, Heading, Flex, Text } from '@chakra-ui/react'

function Header() {
    return (
        <Flex
            as="header"
            alignItems="center"
            justifyContent="space-between"
            padding="12px 24px"
            backgroundColor="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex alignItems="center" gap={1}>
                <Text fontSize="24px" fontWeight='bold' letterSpacing="-0.5px">
                    Productivity
                </Text>
                <Text fontSize="24px" fontWeight="300" fontStyle="italic" color="gray.500">
                    Folder
                </Text>
            </Flex>
            <Nav />
        </Flex>
    );
}



export default Header;