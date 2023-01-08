import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button, Accordion, Stack, Group, Slider, LoadingOverlay, Modal, Burger } from '@mantine/core';
import { IonIcon } from '@ionic/react';
import { home, body, informationCircle, notifications, notificationsOff } from 'ionicons/icons'

import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import Webcam from 'react-webcam';
import '../App.css';

type AppState = {
	stretchRemind: boolean;
	waterRemind: boolean;
	current: string;
}

export default function Application({ faceApiWorker }:any) {
	const [ openedModal, setOpened ] = useState(false);
	const [ openedNav, setOpenedNav ] = useState(false);
	
	const [ waterRemind, setWaterRemind ] = useState(false);
	const [ stretchRemind, setStretchRemind ] = useState(false);

	const [ accordionOpen, setAccordionOpen ] = useState<string | null>(null);
	useEffect(() => {
		if (!openedNav) {
			setAccordionOpen(null);
		}
	}, [ openedNav ]);


	const [ visible, setVisible ] = useState(true);
	const [ mirrorCamera, setMirrorCamera ] = useState(true);
	
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

	const [ slouchY, setSlouchY ] = useState(50);
	const [ maxSlider, setMaxSlider ] = useState(480);
	const [ timer, setTimer ] = useState({
		counter: 0
	});

	useEffect(() => {
		console.log(facePos.y);
		console.log((((slouchY*-1)+100)/100)*maxSlider);
		console.log(facePos.y > (((slouchY*-1)+100)/100)*maxSlider);

		if (facePos.y > (((slouchY*-1)+100)/100)*maxSlider) {
			setTimer({
				counter: timer.counter + 1
			})
			
			// just to have a waiting time before it actually says that you are slouching
			if (timer.counter >= 10) {	
				setTimer({
					counter: 0
				});

				if (Notification.permission !== 'granted') {
					Notification.requestPermission();
				  }

				if (Notification.permission === 'granted') {
					new Notification('Slouching', {
						body: 'Sit up straight!'
					});
				}
				
				showNotification({
					title: 'Slouching',
					id: uuidv4(),
					autoClose: 1000,
					message: 'Sit up straight!'
				});
			}
		} else {
			setTimer({
				counter: 0
			});
		}
	}, [ facePos ]);

	// @ts-ignore ts(2739)
	const appState:AppState = useRef('uninitialized');
	useEffect(() => {
		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		  }
		if (appState.current === 'uninitialized') {
			setInterval(async () => {
				await detectPerson(faceApiWorker, setFaceBox);
				setVisible(false);
			}, 750);
			
			setInterval(() => {
				var now = new Date(),

				minutes = now.getMinutes();

				if (minutes === 0) {
					notifyWater();
					notifyStretch();
				}
				if (minutes === 30) {
					notifyStretch();
				}
				
			}, 60000);
		
			appState.current = 'initialized';
		}
	}, []);

	function notifyWater() {
		if (appState.waterRemind !== true) return;

		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		  }
	
		if (Notification.permission === 'granted') {
			new Notification('Water Reminder', {
				body: 'Drink Some Water!'
			});
		}
		showNotification({
			title: 'Water Reminder',
			id: uuidv4(),
			autoClose: 60000,
			message: 'Drink Some Water!'
		 });
	}
	function notifyStretch() {
		if (appState.stretchRemind !== true) return;

		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		}
		
		if (Notification.permission === 'granted') {
			new Notification('Stertch Reminder', {
				body: 'Get Up From Your Chair!'
			});
		}

		showNotification({
			title: 'Stretch Reminder',
			id: uuidv4(),
			autoClose: 60000,
			message: 'Get Up From Your Chair!'
		});
	}

	return (
		<>
			<div className='app-organizer'>
				<section className='slidebar' style={{ width: `${openedNav ? 350 : 70}px` }} >
					<Burger
						opened={openedNav}
						onClick={() => setOpenedNav((opend) => !opend)}
					/>
					<Accordion
						variant='filled'
						radius='md'
						transitionDuration={500}
						styles={{
							item: {
								backgroundColor: '#32C383',
								border: 'none',
								color: '#7c7c7c',
								'&[data-active]': {
									backgroundColor: 'white',
								},
							},
							control: {
								color: 'white',
								borderRadius: 10,
								'&[data-active]': {
									color: '#32C383',
									backgroundColor: 'transparent',
								},
								':hover': {
									backgroundColor: 'transparent',
								},
							}
						}}
						value={accordionOpen}
						onChange={setAccordionOpen}
					>	
						<Accordion.Item value='Slouch Options'>
							<Accordion.Control><Text fw={700}>Slouch Options</Text></Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<Text>Slouch Threshold</Text>
									<Slider w={275} value={slouchY} onChange={setSlouchY} label={null} />
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value='flexibility'>
							<Accordion.Control><Text fw={700}>Water Reminder</Text></Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<Button onClick={() => {
										setWaterRemind(prev => !prev);
										appState.waterRemind = !waterRemind;
									}}>
										{waterRemind ? 'Disable' : 'Enable'} Water Reminders
									</Button>

									<Text>If you toggle this setting, every time it is something o'clock (Every hour), you will recieve a desktop notification that reminds you to drink water!</Text>

									<Group>
										Currently:  
										{waterRemind ? <IonIcon icon={notifications} size='small' /> : <IonIcon icon={notificationsOff} size='small' />}
									</Group>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value='focus-ring'>
							<Accordion.Control><Text fw={700}>Stretch Reminder</Text></Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<Button onClick={() => {
										setStretchRemind(prev => !prev);
										appState.stretchRemind = !stretchRemind;
									}}>
										{stretchRemind ? 'Disable' : 'Enable'} Stretch Reminders
									</Button>

									<Text>If you toggle this setting, every time it is something o'clock or half past something (Every thirty minutes), you will receive a desktop notification that reminds you to get up and stretch!</Text>

									<Group>
										Currently:  
										{stretchRemind ? <IonIcon icon={notifications} size='small' /> : <IonIcon icon={notificationsOff} size='small' />}
									</Group>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					
				</section>


				<section className='content'>
					<Group className='top-buttons'>
						<Button className='info-button' onClick={() => setOpened(true)}>
							<IonIcon icon={informationCircle} size='small' />
						</Button>

						<Link to=''>
							<Button className='home-button'>
								<IonIcon icon={home} size='small' />
							</Button>
						</Link>
					</Group>

					<div className='corner-rounder-outer'>
						<div className='corner-rounder-inner'></div>
					</div>

					<div></div>

					<div className='screen' style={{ transform: (mirrorCamera ? (openedNav ? 'scale(-1.2, 1.2)' : 'scale(-1.4, 1.4)') : (openedNav ? 'scale(1.2, 1.2)' : 'scale(1.4, 1.4)')) }}>
						<LoadingOverlay visible={visible} overlayBlur={2} />
						<Webcam
							audio={false}
							id='stream-element'
							className='camera-stream'
						/>
						<div className='slouch-line' style={{ top: (((slouchY*-1)+100)/100)*maxSlider }}></div>
						{/* <div className='slouch-line' style={{ top: (slouchY/100)*maxSlider }}></div> */}
						<div className='detection-indicator' style={{ opacity: (faceBox.shown ? 1 : 0), top: faceBox.y }}>
							<div className='detection-line' style={{ width: faceBox.x }}></div>
							<div className='detection-box' style={{ width: faceBox.width, height: faceBox.height }}></div>
							<div className='detection-line'></div>
						</div>
					</div>
					<Button onClick={() => setMirrorCamera(prev => !prev)}
						style={{ marginBottom: 0 }}
					>
						Mirror Video
					</Button>
				</section>


				<Modal
					opened={openedModal}
					onClose={() => setOpened(false)}
					title={<Text fw={800}>How To Use</Text>}
					// overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9]: theme.colors.gray[2]}
					// overlayOpacity={0.55}
					overlayBlur={3}
					// transition="skew-down"
					// transitionDuration={600}
					// transitionTimingFunction="ease"
					centered
				>
					How to use the Wellness Wizard's slouch stopper
					<ol>
						<li>Sit up straight and position the dashed line slightly below the solid line</li>
						
						<li>Slouch down and confirm that the dashed line is above the solid line</li>
						
						<li>Enjoy the benefits of a proper posture!</li>
					</ol>
				</Modal>

			</div>

		</>
	);
}

async function detectPerson(faceApiWorker:any, setFaceBox:React.Dispatch<React.SetStateAction<any>>) {
	// @ts-ignore: ts(2345)
	const detection = await faceApiWorker.detectFace();
	if (detection === undefined) {
		return setFaceBox((prevState:any) => ({
			...prevState,
			shown: false
		}));

		/*return showNotification({
			title: 'Face not detected',
			id: uuidv4(),
			autoClose: 1000,
			message: 'No face recognized'
		});*/
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