import { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';

import Home from './routes/Home';
import Application from './routes/Application';

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

const createWorker = createWorkerFactory(() => import('./workers/faceApiWorker'));

export default function Routerthing() {

	const faceApiWorker = useWorker(createWorker);

	useEffect(() => {
		(async () => {
			await faceApiWorker.loadModal();
			faceApiWorker.detectFace();
		})();
	}, []);

	return (
		<Router>
			<Switch>

				<Route path='/app'>
					<Application faceApiWorker={faceApiWorker} />
				</Route>

				<Route path='*'>
					<Home faceApiWorker={faceApiWorker} />
				</Route>

			</Switch>
		</Router>
	);
}