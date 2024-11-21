import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider 
      activeChain="polygon"
      clientId="b046a262aed43c52349454953d64c149"
    >
      <App />
    </ThirdwebProvider>
  </StrictMode>
);