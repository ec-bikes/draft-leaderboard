import React from 'react';
import { CssBaseline, ThemeProvider, Container, Box } from '@mui/material';
import { theme } from './theme.js';

export default function Layout(props: { children: React.ReactNode }) {
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
