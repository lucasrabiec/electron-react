import { extendTheme } from '@chakra-ui/react';

export const expandedTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'blue.800',
        color: 'gray.400',
      },
      '.js-focus-visible :focus:not([data-focus-visible-added])': {
        outline: 'none',
        boxShadow: 'none',
      },
    },
  },
});
