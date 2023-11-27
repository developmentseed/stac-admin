import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flex, Heading, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button } from "@chakra-ui/react";
import { useStacSearch } from "@developmentseed/stac-react";
import { StacItem } from "stac-ts";

import { Loading } from "../../components";
import { usePageTitle } from "../../hooks";
import ItemListFilter from "./ItemListFilter";

function ItemList() {
  usePageTitle('Items');
  const {
    results,
    state,
    submit,
    nextPage,
    previousPage,
    ...searchState
  } = useStacSearch();

  useEffect(() => {
    if (results) return;
    submit();
  }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Heading as="h1">Items</Heading>
      <ItemListFilter submit={submit} {...searchState} />
      { !results || state === 'LOADING' ? (
        <Loading>Loading items...</Loading>
      ) : (
        <>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Collection</Th>
                  <Th aria-label="Actions"></Th>
                </Tr>
              </Thead>
              <Tbody>
              {results.features.map(({ id, collection }: StacItem) => (
                <Tr key={id}>
                  <Td>{id}</Td>
                  <Td>{collection}</Td>
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
