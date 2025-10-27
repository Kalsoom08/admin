import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from '@redux/store';
import { ThemeProvider } from '@hooks/themeProvider';
import { Toaster } from 'sonner';
import {attachStore} from '@utils/axiosInstance'
attachStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Toaster richColors />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
