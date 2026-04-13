import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IdeaProvider } from './context/IdeaContext';
import { router } from './routes';
import './index.css';

console.log("BASE:", import.meta.env.VITE_API_BASE_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <IdeaProvider>
        <RouterProvider router={router} />
      </IdeaProvider>
    </AuthProvider>
  </StrictMode>,
);
