import { useState, useRef, useCallback } from "react";
import { Box, Button, Text, useDisclosure, Icon } from "@chakra-ui/react";
import { MdChevronLeft, MdExpandMore } from 'react-icons/md'
import { useCollections } from "@developmentseed/stac-react";
import Map, { type MapRef, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { StacCollection } from "stac-ts";

import { DateRangeInput, SelectInput, TextInput } from "../../components/forms";
import DrawBboxControl from "./DrawBboxControl";

type ItemListFilterProps = {
  ids?: string[];
  setIds: (ids: string[]) => void
  bbox?: number[];
  setBbox: (bbox: number[]) => void;
  collections?: StacCollection[];
  setCollections: (collections: string[]) => void;
  dateRangeFrom?: string;
  setDateRangeFrom: (date: string) => void;
  dateRangeTo?: string;
  setDateRangeTo: (date: string) => void;
  submit: () => void;
}

function ItemListFilter({
  ids,
  setIds,
  bbox,
  setBbox,
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

  const handleItemIdChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIds(event.target.value.split(',').map(val => val.trim()))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    submit();
    onClose();
  }

  // Date range state and handlers
  const dateRangeFromValue = dateRangeFrom?.split('T')[0];
  const handleDateRangeFrom = (value: string) => setDateRangeFrom(value ? `${value}T00:00:00Z` : '');
  const dateRangeToValue = dateRangeTo?.split('T')[0];
  const handleDateRangeTo = (value: string) => setDateRangeTo(value ? `${value}T00:00:00Z` : '');
  const rangeError = (!!dateRangeTo && !!dateRangeFrom) && dateRangeFrom >= dateRangeTo;

  // BBox state and handlers
  const mapRef = useRef() as React.MutableRefObject<MapRef>;
  const [ isDrawing, setIsDrawing ] = useState(false);
  const handleDrawComplete = useCallback((bbox: number[]) => {
    setIsDrawing(false);
    setBbox(bbox);
  }, [setBbox]);

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
          <TextInput label="Item IDs" onChange={handleItemIdChange} helper="Enter a comma-separated list of item IDs you want to match." />
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
        <Box display="grid" gridTemplateRows="max-content 1fr" gap="2">
          <Box>
            { isDrawing ? (
              <Text p="0" m="0">Click on the map and drag to draw selected area.</Text>
            ) : (
              <Button variant="link" onClick={() => setIsDrawing(true)} p="0">Add bounding box filter</Button>
            )}
          </Box>
          <Box>
            <Map ref={mapRef} >
              <Source
                id="background"
                type="raster"
                tiles={['https://tile.openstreetmap.org/{z}/{x}/{y}.png']}
                tileSize={256}
                attribution="Background tiles: © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
              >
                <Layer id="background-tiles" type="raster" />
              </Source>
              <DrawBboxControl map={mapRef.current} isEnabled={isDrawing} handleDrawComplete={handleDrawComplete} bbox={bbox} />
            </Map>
          </Box>
        </Box>
        <Box gridColumn="1/3" justifySelf="end">
          <Button type="submit" size="sm">Apply filter</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ItemListFilter;
