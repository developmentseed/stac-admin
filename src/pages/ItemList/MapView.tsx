import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";
import Map, {  type MapRef, type MapLayerMouseEvent, Source, Layer } from "react-map-gl/maplibre";
import { StacItem } from "stac-ts";
import getBbox from "@turf/bbox";

type MapViewProps = {
  results?: {
    type: "FeatureCollection";
    features: StacItem[]
  };
  highlightItem?: string;
  setHighlightItem: (id?: string) => void;
}

const resultsOutline = {
  "line-color": "#C53030",
  "line-width": 1,
};

const resultsFill = {
  "fill-color": "#C53030",
  "fill-opacity": 0.1
};

const resultsHighlight = {
  "fill-color": "#F6E05E",
  "fill-opacity": .7
};

function MapView({ results, highlightItem, setHighlightItem }: MapViewProps) {
  const [ map, setMap ] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);
  const highlightFilter = useMemo(() => ["==", ["get", "id"], highlightItem || ""], [highlightItem]);


  // MapLibre doesn't preserve IDs so we're adding the ID
  // to the properties so we can identify the items for user interactions.
  const resultsWithIDs = useMemo(() => {
    if (!results?.features) return null;
    return {
      ...results,
      features: results.features.map(addIdToProperties)
    };
  }, [results]);


  // Fit the map view around the current results bbox
  useEffect(() => {
    const bounds = results?.features.length && getBbox(results);

    map?.once("load", () => {
      // For some reason this is need to set the bounds after the initial load
      if(bounds) {
        const [x1, y1, x2, y2] = bounds;
        map.fitBounds([x1, y1, x2, y2], { padding: 30, duration: 10 });
      }
    });

    if (map && bounds) {
      const [x1, y1, x2, y2] = bounds;
      map.fitBounds([x1, y1, x2, y2], { padding: 30 });
    }
  }, [map, results]);


  const handleHover = useCallback((e: MapLayerMouseEvent) => {
    const interactiveItem = e.features && e.features[0];
    if(interactiveItem) {
      setHighlightItem(interactiveItem.properties?.id);
    }
  }, [setHighlightItem]);

  return (
    <Box
      position="sticky"
      top="4"
      h="calc(100vh - 2.5rem)"
      maxH="650px"
      flexBasis="500px"
    >
      <Map
        ref={setMapRef}
        onMouseMove={handleHover}
        onMouseLeave={() => setHighlightItem()}
        interactiveLayerIds={["results-fill"]}
      >
        <Source
          id="background"
          type="raster"
          tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
          tileSize={256}
          attribution="Background tiles: © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
        >
          <Layer id="background-tiles" type="raster" />
        </Source>
        { results && (
          <Source
            id="results"
            type="geojson"
            data={resultsWithIDs}
          >
            <Layer id="results-line" type="line" paint={resultsOutline} />
            <Layer id="results-fill" type="fill" paint={resultsFill} />
            <Layer id="results-hover" type="fill" paint={resultsHighlight} filter={highlightFilter as any} />
          </Source>
        )}
      </Map>
    </Box>
  );
}

const addIdToProperties = (feature: StacItem) => {
  if (feature.properties.id) return feature;

  return {
    ...feature,
    properties: {
      ...feature.properties,
      id: feature.id
    }
  };
};

export default MapView;
