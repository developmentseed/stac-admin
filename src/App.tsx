import {
  ChakraProvider,
  Box,
  Container,
} from "@chakra-ui/react"
import theme from "./theme"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Container mx="auto" p="5" bgColor="white" boxShadow="md">
      <Box
        as="header"
        borderColor="gray.50"
        borderBlockEnd="1px dashed"
        fontWeight="bold"
        mb="4"
        pb="4"
        textTransform="uppercase"
      >
        STAC Admin
      </Box>
      <Box as="main">
        Main
      </Box>
    </Container>
  </ChakraProvider>
)
