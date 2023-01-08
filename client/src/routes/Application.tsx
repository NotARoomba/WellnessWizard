import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Menu, Button, createStyles, Accordion, Stack, Group, Slider, LoadingOverlay, Modal, Burger } from '@mantine/core';
import { IonIcon } from '@ionic/react';
import { home, body, informationCircle, homeOutline } from 'ionicons/icons'

import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import Webcam from 'react-webcam';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import '../App.css';


const createWorker = createWorkerFactory(() => import('../workers/faceApiWorker'));

export default function Application() {
	const [openedModal, setOpened] = useState(false);
	const [openedNav, setOpenedNav] = useState(false);

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
  
	const useStyles = createStyles((theme) => ({
		item: {
		  '&[data-hovered]': {
			backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
			color: theme.white,
		  },
		},
	}));
	
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
			function play() {
					var audio = new Audio('/assets/sounds/soundeffect.mp3');
					audio.currentTime = 0;
					audio.play()
				}
			if (facePos.y > (slouchY/100)*maxSlider) {
			setTimer({
				counter: timer.counter + 1
			})
			
			//just to have a waiting time before it actually says that you are slouching
			if (timer.counter >= 5) {	
				setTimer({
					counter: 0
				})
				play();			

				if (Notification.permission !== 'granted') {
					Notification.requestPermission();
				  }

				if (Notification.permission === 'granted') {
					// const notification = new Notification('Slouching', {
					// body: 'Sit up straight!'
					// //icon: '/path/to/icon.png'
					// });
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
			{/* <div className='container'> */}
				{/* <div className='menu'>
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Button>Toggle Menu</Button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>Navigation</Menu.Label>
							<Menu.Item icon={<IonIcon icon={home} />}><Link to='/'>Home</Link></Menu.Item>
							<Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
							<Menu.Item color = "MediumSeaGreen" icon={<Icon3dCubeSphere size={14} />}>Reminder Room</Menu.Item>
							<Menu.Item icon={<IconUsers size={14} />}>About</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div> */}

				{/*We moved the screen div into here and then did the funky stuff with the other css file. That is why we have teh container and menu classes above.*/}
			{/* </div> */}

			<div className='app-organizer'>
				<section className='slidebar' style={{ width: `${openedNav ? 350 : 70}px` }} >
					<Burger
						size={30}
						opened={openedNav}
						onClick={() => setOpenedNav((opend) => !opend)}
					/>
					<Accordion
						variant='filled'
						radius='md'
						transitionDuration={500}
						styles={{
							item: {
								// styles added to all items
								backgroundColor: '#32C383',
								// border: '1px solid #D2EBE0',
								border: 'none',
								color: '#6e6e6e',

								// styles added to expanded item
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
									// backgroundColor: '#4FB286',
								},
								':hover': {
									backgroundColor: 'transparent',
									// backgroundColor: '#4FB286',
								},
							}
						}}
					>
						<Accordion.Item value='Slouch Options'>
							<Accordion.Control><Text fw={700}>Slouch Options</Text></Accordion.Control>
							<Accordion.Panel>

								<Stack>
									<Text fw={700}>Slouch Threshold</Text>
									<Slider w={275} value={slouchY} onChange={setSlouchY} label={null} />
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value='flexibility'>
							<Accordion.Control>Flexibility</Accordion.Control>
							<Accordion.Panel>Configure components appearance and behavior with vast amount of settings or overwrite any part of component styles</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value='focus-ring'>
							<Accordion.Control>No annoying focus ring</Accordion.Control>
							<Accordion.Panel>With new :focus-visible pseudo-class focus ring appears only when user navigates with keyboard</Accordion.Panel>
						</Accordion.Item>
					</Accordion>

					{/* <Menu shadow="md" width={200}>
						<Menu.Target>
							<Button variant='subtle' color='gray'>
							<Text>Stand up</Text>
							<IonIcon icon={body} />
						</Button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>Navigation</Menu.Label>
							<Menu.Item icon={<IonIcon icon={home} />}><Link to='/'>Home</Link></Menu.Item>
							<Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
							<Menu.Item color = "MediumSeaGreen" icon={<Icon3dCubeSphere size={14} />}>Reminder Room</Menu.Item>
							<Menu.Item icon={<IconUsers size={14} />}>About</Menu.Item>
						</Menu.Dropdown>
					</Menu> */}
					
				</section>

				<Button className='info-button' onClick={() => setOpened(true)}>
					<IonIcon icon={informationCircle} size='small' />
				</Button>

				<Button className='home-button' onClick={() => window.location.href = '/'}>
					<IonIcon icon={homeOutline} size='small' />
				</Button>

				{/* <div className='screen' style={{ scale: (openedNav ? 1.1 : 1.4) }}> */}
				<div className='screen' style={{ transform: (openedNav ? 'scale(-1.2, 1.2)' : 'scale(-1.4, 1.4)') }}>
					<LoadingOverlay visible={visible} overlayBlur={2} />
					<Webcam
						audio={false}
						id='stream-element'
						className='camera-stream'
					/>
					{/* <div className='slouch-line' style={{ top: (((slouchY*-1)+100)/100)*maxSlider }}></div> */}
					<div className='slouch-line' style={{ top: (slouchY/100)*maxSlider }}></div>
					<div className='detection-indicator' style={{ opacity: (faceBox.shown ? 1 : 0), top: faceBox.y }}>
						<div className='detection-line' style={{ width: faceBox.x }}></div>
						<div className='detection-box' style={{ width: faceBox.width, height: faceBox.height }}></div>
						<div className='detection-line'></div>
					</div>
				</div>

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
				
				<Group>
					{/* <Link to='/'>Go Back</Link> */}
					
					
					
				</Group>

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