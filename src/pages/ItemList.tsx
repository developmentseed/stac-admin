import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flex, Heading, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button } from "@chakra-ui/react";
import { useStacSearch } from "@developmentseed/stac-react";

import { Loading } from "../components";
import { StacItem } from "stac-ts";
import { usePageTitle } from "../hooks";

function ItemList() {
  usePageTitle('Items');
  const { results, state, submit, nextPage, previousPage } = useStacSearch();

  useEffect(submit, [submit]);

  return (
    <>
      <Heading as="h1">Items</Heading>
      { !results || state === 'LOADING' ? (
        <Loading>Loading items...</Loading>
      ) : (
        <>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th aria-label="Actions"></Th>
                </Tr>
              </Thead>
              <Tbody>
              {results.features.map(({ id, collection }: StacItem) => (
                <Tr key={id}>
                  <Td>{id}</Td>
                  <Td fontSize="sm">
                    <Link to={`/collections/${collection}/items/${id}`}>Edit</Link>
                  </Td>
                </Tr>
              ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex mt="4" display="flex" justifyContent="flex-end" gap="2" fontSize="sm">
            { previousPage && <Button variant="link" size="sm" onClick={previousPage}>Previous page</Button>}
            { (previousPage && nextPage) && " | "}
            { nextPage && <Button variant="link" size="sm" onClick={nextPage}>Next page</Button> }
          </Flex>
        </>
      )}
    </>
  );
}

export default ItemList;
