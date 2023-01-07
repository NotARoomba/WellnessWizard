import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button, Group, Slider, LoadingOverlay, Modal, useMantineTheme, Burger } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import Webcam from 'react-webcam';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import React, { Component } from "react";
import '../App.css';


const createWorker = createWorkerFactory(() => import('../workers/faceApiWorker'));

export default function Application() {
	const [opened, setOpened] = useState(false);
	const theme = useMantineTheme();

	const faceApiWorker = useWorker(createWorker);

	const [ visible, setVisible ] = useState(true);
	

	/*const AudioPlayer = () => {
	  const audioRef = useRef(null);
	
	  const handlePlay = () => {
		audioRef.current.play();
	  };
	
	  return (
		<div>
		  <button onClick={handlePlay}>Play</button>
		  <audio ref={audioRef} src="client/src/routes/soundeffect.mp3" />
		</div>
	  );
	};*/
  

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
	const [ timer, setTimer ] = useState({
		counter: 0
	});

	useEffect(() => {
		if (facePos.y > (slouchY/100)*maxSlider) {
			setTimer({
				counter: timer.counter + 1
			})
			
			//just to have a waiting time before it actually says that you are slouching
			if (timer.counter >= 5) {	
				setTimer({
					counter: 0
				})
								
				//const audio = new Audio('client/src/routes/ping.mp3');
				//audio.play();

				if (Notification.permission !== 'granted') {
					Notification.requestPermission();
				  }

				if (Notification.permission === 'granted') {
					const notification = new Notification('Slouching', {
					body: 'Sit up straight!'
					//icon: '/path/to/icon.png'
					});
					notification;
				}
				
				return showNotification({
					title: 'Slouching',
					id: uuidv4(),
					autoClose: 1000,
					message: 'Sit up straight!'
				 });
			}
		} else {
			setTimer({
				counter: 0
			})
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

				<Modal
					withCloseButton={false}
					opened={opened}
					onClose={() => setOpened(false)}
					title="How to use 早上好中國"
					overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9]: theme.colors.gray[2]}
					overlayOpacity={0.55}
					overlayBlur={3}
					transition="skew-down"
					transitionDuration={600}
					transitionTimingFunction="ease"
				>
				1. Sit up straight and position the dashed line slightly below the solid line
				<br/><br/>
				2. Slouch down and confirm that the dashed line is above the solid line
				<br/><br/>
				3. Enjoy the benefits of a proper posture!
				</Modal>
				<Group>
					<Link to='/'>Go Back</Link>

					<Slider w={300} onChange={setSlouchY}
						label={null}
					/>
					<Button onClick={() => setOpened(true)}>i</Button>
					
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