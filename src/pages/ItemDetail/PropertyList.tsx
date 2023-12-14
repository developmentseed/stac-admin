import { As, Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Property, PropertyGroup } from "../../types";

type PropertyListProps = {
  properties: PropertyGroup;
  headerLevel?: As;
}

type PropType = [string, Property]

const IGNORE_PROPS = ["proj:bbox", "proj:geometry"];

function PropertyList({ properties, headerLevel = "h2" }: PropertyListProps) {
  const { label, properties: props } = properties;
  return (
    <Box mb="4">
      <Text as={headerLevel}>{label || "Common Metadata"}</Text>
      {Object.entries(props)
        .filter(([ key ]: PropType) => !IGNORE_PROPS.includes(key))
        .map(([ key, val ]: PropType, index: number) => (
          val.items ? (
            <>
              <Text>{val.label}</Text>
              <TableContainer key={key}>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      { val.itemOrder.map((item) => (
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        <Th key={item}>{val.items![item].label}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    { val.value.map((value) => (
                      <Tr key={value.name}>
                        {val.itemOrder.map((item) => (
                          <Td key={item}>{value[item]}</Td>
                        ))}
                      </Tr>
                    )) }
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box
              key={key}
              bgColor={index % 2 === 0 ? "gray.50" : "inherit"}
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="2"
              px="2"
              py="1"
            >
              <Box dangerouslySetInnerHTML={{__html: val.label}} />
              <Box dangerouslySetInnerHTML={{__html: val.formatted}} />
            </Box>
          )
        ))}
    </Box>
  );
}

export default PropertyList;
