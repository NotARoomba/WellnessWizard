import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";

import App from './App';
import './index.css';
import Application from './routes/Application';

import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/app",
    element: <Application />,
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{
      colorScheme: 'dark',
      colors: {
        primary: [ '#EAEFED', '#D2EBE0', '#BAE5D2', '#A3E0C5', '#80D2AE', '#4FB286', '#32C383', '#2FD089', '#29DD8D', "#23FF9D" ]
      },
      primaryColor: 'primary',
      primaryShade: 6,
    }}>
      <NotificationsProvider>

        <RouterProvider router={router} />

      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
);
