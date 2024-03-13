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
});

theme.typography.fontFamily =
  'Inter, system-ui, Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';

theme.typography.h1 = {
  fontSize: '2.5rem',
  [theme.breakpoints.up('sm')]: { fontSize: '2.8rem' },
  [theme.breakpoints.up('md')]: { fontSize: '3.2rem' },
  lineHeight: '1.1',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: 0,
};
theme.typography.h2 = {
  fontSize: '2.5rem',
  [theme.breakpoints.up('sm')]: { fontSize: '2.8rem' },
  [theme.breakpoints.up('md')]: { fontSize: '3.2rem' },
  lineHeight: '1.1',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: 0,
};
theme.typography.h3 = {
  fontSize: '1.3rem',
  lineHeight: '1.3',
  fontWeight: 'normal',
  margin: 0,
};
