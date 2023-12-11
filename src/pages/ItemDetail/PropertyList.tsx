import { Box, Text } from "@chakra-ui/react";
import { Property, PropertyGroup } from "../../types";

type PropertyListProps = {
  properties: PropertyGroup
}

type PropType = [string, Property]

const IGNORE_PROPS = ["proj:bbox", "proj:geometry"];

function PropertyList({ properties }: PropertyListProps) {
  const { label, properties: props } = properties;
  return (
    <Box style={{ breakInside: "avoid-column" }}>
      <Text as="h2" mt="0">{label || "Common Metadata"}</Text>
      <Box as="dl" mb="4">
        {Object.entries(props)
          .filter(([ key ]: PropType) => !IGNORE_PROPS.includes(key))
          .map(([ key, val ]: PropType, index: number) => (
            <Box
              key={key}
              bgColor={index % 2 === 0 ? "gray.50" : "inherit"}
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="2"
              px="2"
              py="1"
            >
              <dt dangerouslySetInnerHTML={{__html: val.label}} />
              <dd dangerouslySetInnerHTML={{__html: val.formatted}} />
            </Box>
          ))}
      </Box>
    </Box>
  );
}

export default PropertyList;
