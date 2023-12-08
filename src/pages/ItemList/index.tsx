import { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Button,
  Select,
  Text,
  usePrevious,
  Box,
  Icon,
  useDisclosure
} from "@chakra-ui/react";
import { MdChevronLeft, MdExpandMore } from "react-icons/md";
import { useStacSearch } from "@developmentseed/stac-react";

import { usePageTitle } from "../../hooks";
import { Sort } from "../../components/SortableTh";
import ItemListFilter from "./ItemListFilter";
import TableView from "./TableView";
import MapView from "./MapView";

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

  // Submit handlers and effects
  useEffect(() => {
    // Automatically execute a new item search if the sorting or limit have changed
    if (sortby !== previousSortby || limit !== previousLimit) {
      submit();
    }
  }, [sortby, previousSortby, submit, limit, previousLimit]);

  const sort = sortby?.length ? sortby[0] : undefined;
  const handleSort = (sort: Sort) => setSortby([ sort ]);

  // Submit handlers and effects
  useEffect(() => {
    // Automatically submit to receive intial results
    if (results) return;
    submit();
  }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    submit();
    onClose();
  };

  // Filter form states and hooks
  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure();
  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();

  // Map view state
  const [ showMap, setShowMap ] = useState<boolean>(false);
  const [ highlightItem, setHighlightItem ] = useState<string>();

  return (
    <>
      <Box display="flex" alignItems="baseline" gap="4">
        <Heading as="h1" flex="1">Items</Heading>
        <Button
          size="sm"
          variant="link"
          {...buttonProps}
        >
          Filter items
          <Icon as={isOpen ? MdExpandMore : MdChevronLeft} boxSize="4" />
        </Button>
        <Button
          size="sm"
          variant="link"
          onClick={() => setShowMap(prev => !prev)}
          aria-pressed={showMap}
        >
          Show map
        </Button>
      </Box>
      <ItemListFilter submit={handleSubmit} {...disclosureProps} {...searchState} />
      <Box display="flex" gap="4">  
        <TableView
          results={results}
          compact={showMap}
          sort={sort}
          handleSort={handleSort}
          state={state}
          highlightItem={highlightItem}
          setHighlightItem={setHighlightItem}
        />
        { showMap && <MapView results={results} highlightItem={highlightItem} setHighlightItem={setHighlightItem} /> }
      </Box>
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
