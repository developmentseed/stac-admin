import { extendTheme } from '@chakra-ui/react';
import Container from './Container';

export default extendTheme({
  styles: {
    global: {
      body: {
        bgColor: 'gray.50'
      },
      a: {
        color: 'blue.800',
        textDecoration: 'underline',
        _hover: {
          bg: 'yellow.100',
          textDecoration: 'none',
        }
      },
      p: {
        my: '4'
      },
      ul: {
        my: '4'
      },
    },
  },
  components: {
    Container
  },
});
