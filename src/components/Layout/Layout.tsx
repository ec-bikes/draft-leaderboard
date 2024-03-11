import React from 'react';
import { CssBaseline, createTheme, ThemeProvider, Container, Box } from '@mui/material';

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

export function Layout(props: { children: React.ReactNode }) {
  // possibly the provider and baseline ought to be in a "Wrapper" component but that extra layer
  // is really not necessary for the site which currently only has one page/layout
  return (
    <React.StrictMode>
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
    </React.StrictMode>
  );
}
