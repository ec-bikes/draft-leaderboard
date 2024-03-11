import React from 'react';
import { CssBaseline, createTheme, ThemeProvider, Container, Box } from '@mui/material';
import { PageContextProvider } from './usePageContext';
import type { PageContext } from 'vike/types';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica Neue, Helvetica, Arial, sans-serif',
    // h1: {
    //   fontSize: '3.2rem',
    //   fontWeight: 'bold',
    //   lineHeight: '1.1',
    // },
  },
});

export function PageShell(props: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={props.pageContext}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container>
            <Box
              marginLeft="auto"
              marginRight="auto"
              marginTop={{ xs: 2, sm: 4, md: 8 }}
              marginBottom={{ xs: 2, sm: 4 }}
            >
              {props.children}
            </Box>
          </Container>
        </ThemeProvider>
      </PageContextProvider>
    </React.StrictMode>
  );
}
