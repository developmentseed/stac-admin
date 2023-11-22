import { Link } from "react-router-dom";
import { TableContainer, Table, Text, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react'
import { useCollections } from '@developmentseed/stac-react';
import type { StacCollection } from 'stac-ts';
import { Loading } from '../components';

function CollectionList() {
  const { collections, state } = useCollections();

  return (
    <>
      <Text as="h1">Collections</Text>
      { !collections || state === 'LOADING' ? (
        <Loading>Loading collections...</Loading>
      ) : (
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th aria-label="Actions"></Th>
              </Tr>
            </Thead>
            <Tbody>
            {collections.collections.map(({ id }: StacCollection) => (
              <Tr>
                <Td>{id}</Td>
                <Td fontSize="sm">
                  <Link to={`/collections/${id}`}>Edit</Link>
                </Td>
              </Tr>
            ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

export default CollectionList;
