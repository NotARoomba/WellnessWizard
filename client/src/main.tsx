import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Topbar from './topbar/Topbar';
import Routerthing from './Routerthing';

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
				<Topbar />

				<Routerthing />

			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
