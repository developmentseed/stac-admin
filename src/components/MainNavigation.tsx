import { Link as RouterLink } from "react-router-dom";
import { Box, List, ListItem, Link } from "@chakra-ui/react";

type NavItemProps = React.PropsWithChildren<{
  to: string
}>

function NavItem({ to, children }: NavItemProps) {
  return (
    <ListItem px="4" py="1" _hover={{ bgColor: 'gray.100' }}>
      <Link
        as={RouterLink}
        to={to}
        display="block"
        _hover={{ bgColor: 'gray.100' }}
      >
        {children}
      </Link>
    </ListItem>
  );
}

function MainNavigation() {
  return (
    <Box
      as="nav"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="5"
      py="4"
      alignSelf="start"
    >
      <List my="0">
        <NavItem to="/collections/">Collections</NavItem>
        <NavItem to="/items/">Items</NavItem>
      </List>
    </Box>
  );
}

export default MainNavigation;
