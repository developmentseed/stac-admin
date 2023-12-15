import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Heading, Icon, Text } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import Map, { Source, Layer, MapRef } from "react-map-gl/maplibre";
import StacFields from "@radiantearth/stac-fields";
import { useItem } from "@developmentseed/stac-react";
import getBbox from "@turf/bbox";

import { usePageTitle } from "../../hooks";
import { HeadingLead, Loading } from "../../components";
import PropertyList from "./PropertyList";
import { PropertyGroup } from "../../types";
import { BackgroundTiles } from "../../components/Map";
import AssetList from "./AssetList";

const resultsOutline = {
  "line-color": "#C53030",
  "line-width": 1,
};

const resultsFill = {
  "fill-color": "#C53030",
  "fill-opacity": 0.1
};

function ItemDetail() {
  const { collectionId, itemId } = useParams();
  usePageTitle(`Item ${itemId}`);
  const itemResource = `${process.env.REACT_APP_STAC_API}/collections/${collectionId}/items/${itemId}`;
  const { item, state } = useItem(itemResource);

  const [ map, setMap ] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);

  // Fit the map view around the current results bbox
  useEffect(() => {
    const bounds = item && getBbox(item);

    map?.once("load", () => {
      // For some reason this is need to set the bounds after the initial load
      if(bounds) {
        const [x1, y1, x2, y2] = bounds;
        map.fitBounds([x1, y1, x2, y2], { padding: 30, duration: 10 });
      }
    });
  }, [item, map]);

  if (!item || state === "LOADING") {
    return <Loading>Loading item...</Loading>;
  }

  const { title, description, ...properties } = item.properties;
  const formattedProperties = StacFields.formatItemProperties({ properties });

  return (
    <>
      <Heading as="h1">
        <HeadingLead>Item</HeadingLead> {item.id}
      </Heading>
      <Box display="grid" gridTemplateColumns="2fr 1fr" gap="8">
        <Box>
          <Box height="60" borderBottom="1px solid" borderColor="gray.200" pb="8">
            <Map ref={setMapRef} dragPan={false} scrollZoom={false} cursor="default">
              <BackgroundTiles />
              <Source
                id="results"
                type="geojson"
                data={item}
              >
                <Layer id="results-line" type="line" paint={resultsOutline} />
                <Layer id="results-fill" type="fill" paint={resultsFill} />
              </Source>
            </Map>
          </Box>
          <AssetList assets={item.assets} />
        </Box>
        <Box fontSize="sm" borderLeft="1px solid" borderColor="gray.100" pl="8">
          <Box display="flex" gap="4" alignItems="baseline">
            <Text as="h3" fontSize="md" my="0" flex="1">About</Text>
            <Link to="edit/" title="Edit item"><Icon as={MdEdit} boxSize="4" /></Link>
          </Box>
          { (title || description) && (
            <Text mt="0">
              { title && <Text as="b">{ title } </Text> }
              { description }
            </Text>
          )}
          { formattedProperties.map((property: PropertyGroup) => <PropertyList key={property.extension || "default-props"} properties={property} /> )}
        </Box>
      </Box>
    </>
  );
}

export default ItemDetail;
