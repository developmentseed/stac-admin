import { Link as RouterLink } from "react-router-dom";
import { Box, List, ListItem, Link, Button } from "@chakra-ui/react";

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

type MainNavigationProps = {
  isLoggedIn: boolean
  logout: () => void
}

function MainNavigation({ isLoggedIn, logout }: MainNavigationProps) {
  return (
    <Box as="nav" aria-label="Main">
      <List my="0" display="flex" alignItems="center">
        <NavItem to="/">Home</NavItem>
        { isLoggedIn && (
          <>
            <NavItem to="/collections/">Collections</NavItem>
            <NavItem to="/items/">Items</NavItem>
            <Button
              variant="link"
              borderRadius="5"
              px="2"
              py="1"
              color="gray.800"
              _hover={{ bgColor: "gray.100" }}
              fontWeight="normal"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        )}
      </List>
    </Box>
  );
}

export default MainNavigation;
