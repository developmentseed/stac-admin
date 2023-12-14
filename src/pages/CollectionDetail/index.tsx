import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Heading, ListItem, Text, List, Tag } from "@chakra-ui/react";
import { useCollection, useStacSearch } from "@developmentseed/stac-react";
import Map, { Layer, Source, MapRef } from "react-map-gl/maplibre";
import { LngLatBounds } from "maplibre-gl";
import bboxPolygon from "@turf/bbox-polygon";

import { HeadingLead, Loading } from "../../components";
import { usePageTitle } from "../../hooks";
import { StacCollection } from "stac-ts";
import ItemResults from "../../components/ItemResults";
import { BackgroundTiles } from "../../components/Map";

const extentOutline = {
  "line-color": "#276749",
  "line-width": 2,
  "line-dasharray": [2, 2]
};

const dataOutline = {
  "line-color": "#C53030",
  "line-width": 1,
};

function CollectionDetail() {
  const { collectionId } = useParams();
  usePageTitle(`Collection ${collectionId}`);
  const { collection, state } = useCollection(collectionId!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const { results, collections, setCollections, submit, ...stacSearch } = useStacSearch();

  // Initialize the search with the current collection ID
  useEffect(() => {
    setCollections([ collectionId ]);
  }, [collectionId, setCollections]);

  // Automatically submit whenever the collection ID changes
  useEffect(() => {
    if (!collections) return;
    submit();
  }, [collections, submit]);

  const [ map, setMap ] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);

  // Create GeoJSON polygon from extent
  const extent = useMemo(() => {
    if (!collection) return;
    return bboxPolygon(collection.extent.spatial.bbox[0]);
  }, [collection]);

  // Create GeoJSON Feature collection from data extents
  const dataExtents = useMemo(() => {
    if (!collection) return;
    if (collection.extent.spatial.bbox.length > 1) {
      const [_, ...data] = collection.extent.spatial.bbox;
      return {
        type: "FeatureCollection",
        features: data.map(bboxPolygon)
      };
    }
  }, [collection]);

  // Fit the map view around the current collection extent
  useEffect(() => {
    map?.once("load", () => {
      if(collection) {
        const bounds = new LngLatBounds(collection.extent.spatial.bbox[0]);
        for(let i = 1, len = collection.extent.spatial.bbox.length; i < len; i++) {
          bounds.extend(collection.extent.spatial.bbox[i]);
        }
        const [x1, y1, x2, y2] = bounds.toArray().flat();
        map.fitBounds([x1, y1, x2, y2], { padding: {top: 30, bottom: 30, left: 750, right: 30 }, duration: 10 });
      }
    });
  }, [collection, map]);

  if (!collection || state === "LOADING") {
    return <Loading>Loading collection...</Loading>;
  }

  const { id, title, description, keywords } = collection as StacCollection;

  return (
    <>
      <Box height="250px" mx="-5" mb="4" position="relative">
        <Box position="absolute" top="0" left="5" zIndex="1000">
          <Heading as="h1">
            <HeadingLead>Collection</HeadingLead> {id}
          </Heading>
          { title && <Text fontWeight="bold" my="0">{ title }</Text>}
          { description && <Text my="0">{ description }</Text>}
          { (keywords && keywords.length > 0) && (
            <List mt="1">
              {keywords.map((keyword) => (
                <Tag mr="1" as={ListItem} key={keyword}>{keyword}</Tag>
              ))}
            </List>
          )}
          <Button as={Link} to="edit/" size="sm" mt="4">Edit</Button>
        </Box>
        <Map ref={setMapRef} dragPan={false} scrollZoom={false} cursor="default">
          <BackgroundTiles />
          { extent && (
            <Source
              id="extent"
              type="geojson"
              data={extent}
            >
              <Layer id="extent-line" type="line" paint={extentOutline} />
            </Source>
          ) }
          { dataExtents && (
            <Source
              id="data-extent"
              type="geojson"
              data={dataExtents}
            >
              <Layer id="data-extent-line" type="line" paint={dataOutline} />
            </Source>
          ) }
        </Map>
      </Box>
      <Text as="h2">Items in this collection</Text>
      <ItemResults results={results} submit={submit} {...stacSearch} />
    </>
  );
}

export default CollectionDetail;
