import { Box, Spinner, Text } from "@chakra-ui/react";

function Loading({ children }: React.PropsWithChildren) {
  return (
    <Box bgColor="gray.100" borderRadius="5" display="flex" p="2">
      <Spinner thickness="4px" mr="4" />
      {children && <Text my="0">{children}</Text>}
    </Box>
  );
}

export default Loading;
