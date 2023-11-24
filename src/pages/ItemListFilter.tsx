import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react'
import { useCollections } from "@developmentseed/stac-react";
import { MdChevronLeft, MdExpandMore } from 'react-icons/md'
import { DateRangeInput, SelectInput } from "../components/forms";
import { StacCollection } from "stac-ts";

type ItemListFilterProps = {
  collections?: StacCollection[]
  setCollections: (collections: string[]) => void
  dateRangeFrom?: string,
  setDateRangeFrom: (date: string) => void,
  dateRangeTo?: string,
  setDateRangeTo: (date: string) => void,
  submit: () => void
}

function ItemListFilter({
  setCollections,
  dateRangeFrom,
  setDateRangeFrom,
  dateRangeTo,
  setDateRangeTo,
  submit
}: ItemListFilterProps) {
  const { collections } = useCollections();
  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure();
  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();

  const handleSelectCollection: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setCollections([ event.target.value ]);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    submit();
    onClose();
  }

  const dateRangeFromValue = dateRangeFrom?.split('T')[0];
  const handleDateRangeFrom = (value: string) => setDateRangeFrom(value ? `${value}T00:00:00Z` : '');
  const dateRangeToValue = dateRangeTo?.split('T')[0];
  const handleDateRangeTo = (value: string) => setDateRangeTo(value ? `${value}T00:00:00Z` : '');

  const rangeError = (!!dateRangeTo && !!dateRangeFrom) && dateRangeFrom >= dateRangeTo;

  return (
    <Box borderRadius="5" p="2" mb="4" border="2px dashed" borderColor="gray.300">
      <Box textAlign="right">
        <Button
          size="sm"
          variant="link"
          {...buttonProps}
        >
          Filter items
          <Icon as={isOpen ? MdExpandMore : MdChevronLeft} boxSize="4" />
        </Button>
      </Box>
      <Box as="form" onSubmit={handleSubmit} {...disclosureProps} display="grid" gap="4" gridTemplateColumns="1fr 1fr">
        <Box>
          <SelectInput label="Collection" onChange={handleSelectCollection}>
            <option value=""></option>
            { collections?.collections.map(({ id }: StacCollection) => (
              <option key={id} value={id}>{ id }</option>
            ))}
          </SelectInput>
          <DateRangeInput
            label="Date range"
            dateRangeFrom={dateRangeFromValue}
            setDateRangeFrom={handleDateRangeFrom}
            dateRangeTo={dateRangeToValue}
            setDateRangeTo={handleDateRangeTo}
            error={rangeError ? { message: 'The to-date must be later than the from-date.' } : undefined}
          />
        </Box>
        <Box>
          Right
        </Box>
        <Box gridColumn="1/3" justifySelf="end">
          <Button type="submit" size="sm">Apply filter</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ItemListFilter;
