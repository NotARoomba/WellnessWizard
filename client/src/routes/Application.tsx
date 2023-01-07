import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button, Group, Slider, LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { v4 as uuidv4 } from 'uuid';
import Webcam from 'react-webcam';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import '../App.css';

const createWorker = createWorkerFactory(() => import('../workers/faceApiWorker'));

export default function Application() {
	const faceApiWorker = useWorker(createWorker);

	const [ visible, setVisible ] = useState(true);

	const [ faceBox, setFaceBox ] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		shown: false
	});

	const [ facePos, setFacePos ] = useState({
		x: 0,
		y: 0
	});
	useEffect(() => {
		setFacePos({
			x: (faceBox.x + (faceBox.width)/2),
			y: (faceBox.y + (faceBox.height)/2),
		});
	}, [ faceBox ]);

	const [ slouchY, setSlouchY ] = useState(-5);
	const [ maxSlider, setMaxSlider ] = useState(480);

	useEffect(() => {
		if (facePos.y > (slouchY/100)*maxSlider) {
			return showNotification({
				title: 'slouching',
				id: uuidv4(),
				autoClose: 1000,
				message: 'sit up straight!!'
			});
		}
	}, [ facePos ]);

	const appState = useRef('uninitialized');

	useEffect(() => {
		if (appState.current === 'uninitialized') {
			(async () => {
				setInterval(async () => {
					await detectPerson(faceApiWorker, setFaceBox);
					setVisible(false);
				}, 750);
			})();

			appState.current = 'initialized';
		}
	}, []);

	return (
		<>
			<div className='organizer'>

				<div className='screen'>
					<LoadingOverlay visible={visible} overlayBlur={2} />
					<Webcam
						audio={false}
						id='stream-element'
						className='camera-stream'
					/>
					<div className='slouch-line' style={{ top: (slouchY/100)*maxSlider }}></div>
					<div className='detection-indicator' style={{ opacity: (faceBox.shown ? 1 : 0), top: faceBox.y }}>
						<div className='detection-line' style={{ width: faceBox.x }}></div>
						<div className='detection-box' style={{ width: faceBox.width, height: faceBox.height }}></div>
						<div className='detection-line'></div>
					</div>
				</div>

				<Group>
					<Link to='/'>go back</Link>

					<Slider w={300} onChange={setSlouchY}
						label={null}
					/>

					<Button onClick={async () => {
						console.log(await faceApiWorker.test());
					}}>
						DETECT
					</Button>
				</Group>

			</div>

		</>
	);
}

async function detectPerson(faceApiWorker:any, setFaceBox:React.Dispatch<React.SetStateAction<any>>) {
	// @ts-ignore: ts(2345)
	const detection = await faceApiWorker.detectFace();
	if (detection === undefined) {
		setFaceBox((prevState:any) => ({
			...prevState,
			shown: false
		}));

		return showNotification({
			title: 'Face not detected',
			id: uuidv4(),
			autoClose: 1000,
			message: 'No face recognized'
		});
	};

	setFaceBox({
		x: detection.box.x,
		y: detection.box.y,
		height: detection.box.height,
		width: detection.box.width,
		shown: true
	});

	/*showNotification({
		title: `Detected Face`,
		id: uuidv4(),
		autoClose: 1000,
		message: `(${Math.round(detection.box.x)},${Math.round(detection.box.y)})`
	})*/
}