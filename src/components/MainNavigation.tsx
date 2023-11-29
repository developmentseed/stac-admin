import { Link as RouterLink } from "react-router-dom";
import { Box, List, ListItem, Link } from "@chakra-ui/react";

type NavItemProps = React.PropsWithChildren<{
  to: string
}>

function NavItem({ to, children }: NavItemProps) {
  return (
    <ListItem>
      <Link
        as={RouterLink}
        to={to}
        borderRadius="5"
        px="2"
        py="1"
        _hover={{ bgColor: "gray.100" }}
      >
        {children}
      </Link>
    </ListItem>
  );
}

function MainNavigation() {
  return (
    <Box as="nav" aria-label="Main">
      <List my="0" display="flex">
        <NavItem to="/">Home</NavItem>
        <NavItem to="/collections/">Collections</NavItem>
        <NavItem to="/items/">Items</NavItem>
      </List>
    </Box>
  );
}

export default MainNavigation;
