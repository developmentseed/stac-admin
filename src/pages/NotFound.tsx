import { Link } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { usePageTitle } from "../hooks";

function NotFound() {
  usePageTitle("Not found");

  return (
    <>
      <Text as="h1">Not found</Text>
      <Text>Try browsing <Link to="/collections/">collections</Link> or <Link to="/items/">items</Link> instead.</Text>
    </>
  );
}

export default NotFound;
