
import { Box, Text, Flex } from '@chakra-ui/react'

function Footer() {
    return (
        <Box as="footer" justifyContent="space-between" padding={4} display="flex" flexDirection="column" alignItems="center" backgroundColor="#ffffff">
            <Flex gap={4}>
                <a href='https://github.com/bearsanity' target="_blank" rel="noopener noreferrer"> Github </a>
                <a href='https://www.linkedin.com/in/james-sweeney-304905206/' target="_blank" rel="noopener noreferrer"> LinkedIn </a>
            </Flex>
            <Text >&copy; 2026 James Sweeney. All rights reserved.</Text>
        </Box>
    );
}

export default Footer;