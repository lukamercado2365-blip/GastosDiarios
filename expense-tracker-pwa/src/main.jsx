import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ExpensesProvider } from './context/ExpensesContext';
import { SettingsProvider } from './context/SettingsContext';
import App from './App.jsx';
import './styles/main.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpensesProvider>
      <SettingsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SettingsProvider>
    </ExpensesProvider>
  </StrictMode>,
);
