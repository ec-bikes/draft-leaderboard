import { createTheme } from '@mui/material';

const primaryMain = '#ff6f42';
const primaryDark = '#c15432';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: primaryMain, dark: primaryDark },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: primaryDark,
          textDecorationColor: `rgba(193, 84, 50, 0.4)`,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 400,
    fontWeightBold: 600,
    h1: {
      fontSize: '2.3rem',
      lineHeight: '1.1',
      fontWeight: 600,
      textAlign: 'center',
      margin: 0,
    },
    h2: {
      fontSize: '2.5rem',
      lineHeight: '1.1',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 0,
    },
    h3: {
      fontSize: '1.3rem',
      // fontSize: '1.2rem',
      lineHeight: '1.3',
      fontWeight: 'normal',
      margin: 0,
    },
  },
});

theme.typography.h1[theme.breakpoints.up('sm')] = { fontSize: '2.7rem' };
theme.typography.h1[theme.breakpoints.up('md')] = { fontSize: '3rem' };
theme.typography.h2[theme.breakpoints.up('sm')] = { fontSize: '2.7rem' };
theme.typography.h2[theme.breakpoints.up('md')] = { fontSize: '3rem' };
