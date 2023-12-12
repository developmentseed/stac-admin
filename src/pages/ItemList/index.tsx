import { useEffect } from "react";
import { Heading, Box } from "@chakra-ui/react";
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

  return (
    <>
      <Box display="flex" alignItems="baseline" gap="4">
        <Heading as="h1" flex="1">Items</Heading>
      </Box>
      <ItemListFilter submit={submit} {...searchState} />
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
