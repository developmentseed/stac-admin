import { useEffect } from "react";
import {
  Heading,
  Button,
  Box,
  Icon,
  useDisclosure
} from "@chakra-ui/react";
import { MdChevronLeft, MdExpandMore } from "react-icons/md";
import { useStacSearch } from "@developmentseed/stac-react";

import { usePageTitle } from "../../hooks";
import ItemListFilter from "./ItemListFilter";
import ItemResults from "../../components/ItemResults";

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
      </Box>
      <ItemListFilter submit={handleSubmit} {...disclosureProps} {...searchState} />
      <ItemResults
        results={results}
        sortby={sortby}
        setSortby={setSortby}
        limit={limit}
        setLimit={setLimit}
        previousPage={previousPage}
        nextPage={nextPage}
        state={state}
        submit={submit}
      />
    </>
  );
}

export default ItemList;
