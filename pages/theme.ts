import { createTheme } from '@mui/material';

// orange #FF6F42

export const theme = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'rgb(193 84 50)', // #c15432, higher contrast orange
          textDecorationColor: `rgba(193, 84, 50, 0.4)`,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica Neue, Helvetica, Arial, sans-serif',
    // h1: {
    //   fontSize: '3.2rem',
    //   fontWeight: 'bold',
    //   lineHeight: '1.1',
    // },
  },
});
