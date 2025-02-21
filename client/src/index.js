import React from 'react';
import ReactDOM from 'react-dom/client';
import { UIProvider } from "@yamada-ui/react";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </React.StrictMode>
);

reportWebVitals();
