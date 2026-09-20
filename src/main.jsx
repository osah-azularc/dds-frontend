import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import MainStyles from './main.styles';
import store from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MainStyles />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
