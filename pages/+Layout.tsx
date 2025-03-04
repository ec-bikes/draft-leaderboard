import React from 'react';
import { CssBaseline, ThemeProvider, Container } from '@mui/material';
import { globalStyles, theme } from '../components/theme.js';

export default function Layout(props: { children: React.ReactNode }) {
  // Possibly the provider and baseline ought to be in a "Wrapper" component but that extra layer
  // is really not necessary for the site which currently only has one page/layout.
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        {/* The width and props are set in the theme */}
        <Container>{props.children}</Container>
      </ThemeProvider>
    </React.StrictMode>
  );
}
