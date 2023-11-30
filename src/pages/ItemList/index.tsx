import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flex,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  usePrevious
} from "@chakra-ui/react";
import { useStacSearch } from "@developmentseed/stac-react";
import { StacItem } from "stac-ts";

import { Loading } from "../../components";
import { usePageTitle } from "../../hooks";
import ItemListFilter from "./ItemListFilter";
import SortableTh, { Sort } from "../../components/SortableTh";

function ItemList() {
  usePageTitle("Items");
  const {
    results,
    state,
    sortby,
    setSortby,
    submit,
    nextPage,
    previousPage,
    ...searchState
  } = useStacSearch();
  const previousSortby = usePrevious(sortby);

  useEffect(() => {
    if (results) return;
    submit();
  }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Automatically execute a new item search if the sorting has changed
    if (sortby !== previousSortby) {
      submit();
    }
  }, [sortby, previousSortby, submit]);

  const sort = sortby?.length ? sortby[0] : undefined;
  const handleSort = (sort: Sort) => setSortby([ sort ]);

  return (
    <>
      <Heading as="h1">Items</Heading>
      <ItemListFilter submit={submit} {...searchState} />
      { !results || state === "LOADING" ? (
        <Loading>Loading items...</Loading>
      ) : (
        <>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <SortableTh fieldName="id" sort={sort} setSort={handleSort}>ID</SortableTh>
                  <SortableTh fieldName="collection" sort={sort} setSort={handleSort}>Collection</SortableTh>
                  <Th aria-label="Actions" />
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
