import { Link } from "react-router-dom";
import { TableContainer, Table, Text, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react";
import { useCollections } from "@developmentseed/stac-react";
import type { StacCollection } from "stac-ts";
import { Loading } from "../components";
import { usePageTitle } from "../hooks";

function CollectionList() {
  usePageTitle("Collections");
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
                <Tr key={id}>
                  <Td>{id}</Td>
                  <Td fontSize="sm">
                    <Link to={`/collections/${id}`}>Edit</Link>
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
