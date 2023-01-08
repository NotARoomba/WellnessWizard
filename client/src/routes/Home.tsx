import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import logoSVG from './wellnessWizardLogo.svg';
// import { Affix, Button, Text, Transition } from '@mantine/core';

import '../homePage.css';

export default function Home({ faceApiWorker }:any) {

	return (
		<div>
			<div className='topPart'>
				<div className='title'>
					<h1>Wellness Wizard</h1>
				</div>
				<div className="imageContainer">
					<img src={logoSVG} className='logo'/>
				</div>
				<div className = 'btndiv'>
					<Link to='/app/'>
						<button className = 'btn'>
							<span>
								Continue to App!
							</span>
						</button>
					</Link>
				</div>
				<div className='slant1'></div>
			</div>
			<div className = 'bottomPart'>
				<section className='section'>
					<div className='box-main'>
						<div className='firstHalf'>
							<h1 className='about-title'>
								WellnessWizard's Slouch Stopper
							</h1>
							<p className='description'>
								Add description on how that stuff works
							</p>
						</div>
					</div>
				</section>
				<div className='slant2'></div>
				<section className='section'>
					<div className='box-main'>
						<div className='secondHalf'>
							<h1 className='about-title'>
								How to use it
							</h1>
							<p className='description'>
								Description on how to use it
							</p>
						</div>
					</div>
				</section>
				<div className='slant3'></div>
				<section className='section'>
					<div className='box-main'>
						<div className='secondHalf'>
							<h1 className='about-title'>
								Posture Rap
							</h1>
							<h3>
								By ChatGPT
							</h3>
							<p className='description'>
								You might be feeling down, like you're in a rut<br/>
								But good posture can help you rise up, it's a must<br/>
								Stand tall, shoulders back, head held high<br/>
								Good posture will help you reach for the sky<br/>
								<br/>
								So don't slouch, don't hunch, don't drag your feet<br/>
								Good posture will make you feel complete<br/>
								Stand up straight, let your confidence shine<br/>
								Good posture is the key to feeling fine<br/>
								<br/>
								So remember, posture is key<br/>
								Stand tall and proud, let it be<br/>
								Good posture will set you free<br/>
								It's the best way to be<br/>
							</p>
						</div>
					</div>
				</section>
			</div>
			

			<footer className='footer'>
				<p className='text-footer'>
					Copyright ©-All rights are reserved
				</p>
			</footer>
		</div>
	)
}
