import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
