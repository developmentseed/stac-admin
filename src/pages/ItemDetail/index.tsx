import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import Map, { Source, Layer, MapRef } from "react-map-gl/maplibre";
import StacFields from "@radiantearth/stac-fields";
import { useItem } from "@developmentseed/stac-react";
import getBbox from "@turf/bbox";

import { usePageTitle } from "../../hooks";
import { HeadingLead, Loading } from "../../components";
import PropertyList from "./PropertyList";
import { PropertyGroup } from "../../types";

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
        map.fitBounds([x1, y1, x2, y2], { padding: {top: 30, bottom: 30, left: 750, right: 30 }, duration: 10 });
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
      <Box height="250px" mx="-5" mb="4" position="relative">
        <Box position="absolute" top="0" left="5" zIndex="1000">
          <Heading as="h1">
            <HeadingLead>Item</HeadingLead> {item.id}
          </Heading>
          { title && <Text fontWeight="bold" my="0">{ title }</Text>}
          { description && <Text mt="0" mb="2">{ description }</Text>}
          <Button as={Link} to="edit/" size="sm">Edit</Button>
        </Box>
        <Map ref={setMapRef} dragPan={false} scrollZoom={false} cursor="default">
          <Source
            id="background"
            type="raster"
            tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
            tileSize={256}
            attribution="Background tiles: © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
          >
            <Layer id="background-tiles" type="raster" />
          </Source>
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
      <Box style={{ columns: 2 }}>
        { formattedProperties.map((property: PropertyGroup) => <PropertyList key={property.extension || "default-props"} properties={property} /> )}
      </Box>
    </>
  );
}

export default ItemDetail;
