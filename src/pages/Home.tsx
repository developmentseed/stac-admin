import { Text } from '@chakra-ui/react'
import { usePageTitle } from '../hooks';

function Home () {
  usePageTitle('STAC Admin');

  return (
    <>
      <Text as="h1">STAC Admin</Text>
    </>
  )
}

export default Home;
