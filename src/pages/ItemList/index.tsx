import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flex,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Select,
  Text,
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
    limit,
    setLimit,
    submit,
    nextPage,
    previousPage,
    ...searchState
  } = useStacSearch();
  const previousSortby = usePrevious(sortby);
  const previousLimit = usePrevious(limit);

  useEffect(() => {
    if (results) return;
    submit();
  }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Automatically execute a new item search if the sorting or limit have changed
    if (sortby !== previousSortby || limit !== previousLimit) {
      submit();
    }
  }, [sortby, previousSortby, submit, limit, previousLimit]);

  const sort = sortby?.length ? sortby[0] : undefined;
  const handleSort = (sort: Sort) => setSortby([ sort ]);

  return (
    <>
      <Heading as="h1">Items</Heading>
      <ItemListFilter submit={submit} {...searchState} />
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
            { !results || state === "LOADING" ? (
              <Tr>
                <Td colSpan={3}>
                  <Loading>Loading items...</Loading>
                </Td>
              </Tr>
            ) : (
              results.features.map(({ id, collection }: StacItem) => (
                <Tr key={id}>
                  <Td>{id}</Td>
                  <Td>{collection}</Td>
                  <Td fontSize="sm">
                    <Link to={`/collections/${collection}/items/${id}`}>Edit</Link>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex mt="4" display="flex" gap="2" fontSize="sm" alignItems="baseline">
        <Flex flex="1" gap="2" alignItems="baseline">
          <Select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            w="20"
            size="sm"
            id="limit"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
          <Text as="label" htmlFor="limit">items per page</Text>
        </Flex>
        { previousPage && <Button variant="link" size="sm" onClick={previousPage}>Previous page</Button>}
        { (previousPage && nextPage) && " | "}
        { nextPage && <Button variant="link" size="sm" onClick={nextPage}>Next page</Button> }
      </Flex>
    </>
  );
}

export default ItemList;
