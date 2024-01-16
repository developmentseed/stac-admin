import { ReactNode } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home";
import CollectionList from "./pages/CollectionList";
import CollectionForm from "./pages/CollectionForm";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";
import ItemForm from "./pages/ItemForm";
import NotFound from "./pages/NotFound";
import CollectionDetail from "./pages/CollectionDetail";
import { Box, Container } from "@chakra-ui/react";
import { MainNavigation } from "./components";

type StacAdmin = {
  isLoggedIn: boolean
  logout: () => void
  SignIn: ReactNode
}

function StacAdmin({ isLoggedIn, SignIn, logout }: StacAdmin) {
  return (
    <Router>
      <Container mx="auto" p="5" bgColor="white" boxShadow="md">
        <Box
          as="header"
          borderBottom="1px dashed"
          borderColor="gray.300"
          mb="4"
          pb="4"
          display="flex"
        >
          <Box flex="1" fontWeight="bold" textTransform="uppercase">STAC Admin</Box>
          <MainNavigation isLoggedIn={isLoggedIn} logout={logout} />
        </Box>
        <Box as="main">
          { isLoggedIn
            ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections/" element={<CollectionList />} />
                <Route path="/collections/:collectionId/" element={<CollectionDetail />} />
                <Route path="/collections/:collectionId/edit/" element={<CollectionForm />} />
                <Route path="/items/" element={<ItemList />} />
                <Route path="/collections/:collectionId/items/:itemId/" element={<ItemDetail />} />
                <Route path="/collections/:collectionId/items/:itemId/edit/" element={<ItemForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )
            : SignIn }
        </Box>
      </Container>
    </Router>
  );
}

export default StacAdmin;
