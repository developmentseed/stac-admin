import { Link, useNavigate } from "react-router-dom";
import { TableContainer, Table, Text, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react";
import { useCollections } from "@developmentseed/stac-react";
import type { StacCollection } from "stac-ts";
import { Loading } from "../components";
import { usePageTitle } from "../hooks";

function CollectionList() {
  usePageTitle("Collections");
  const navigate = useNavigate();
  const { collections, state } = useCollections();

  return (
    <>
      <Text as="h1">Collections</Text>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th aria-label="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            { !collections || state === "LOADING" ? (
              <Tr>
                <Td colSpan={2}>
                  <Loading>Loading collections...</Loading>
                </Td>
              </Tr>
            ) : (
              collections.collections.map(({ id }: StacCollection) => (
                <Tr
                  key={id}
                  onClick={() => navigate(`/collections/${id}/`)}
                  _hover={{ cursor: "pointer", bgColor: "gray.50" }}
                >
                  <Td>{id}</Td>
                  <Td fontSize="sm">
                    <Link to={`/collections/${id}/`} aria-label={`View collection ${id}`}>View</Link>
                    {" "}|{" "}
                    <Link to={`/collections/${id}/edit/`} aria-label={`Edit collection ${id}`}>Edit</Link>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CollectionList;
