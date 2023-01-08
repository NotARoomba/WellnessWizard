import { Link } from 'react-router-dom';

import React from 'react';
import '../test.css';

function App() {
	return (
		<div>
			<div className="topPart">
				<div className="logo">
					<h1>Put Logo Here</h1>
				</div>

				<div className = "btndiv">
					<button className = "btn" onClick={() => window.location.href = '/app'}>
						Go To The App!
					</button>
				</div>
				<div className="diagonal-line"></div>
			</div>
			<div className = "bottomPart">
				<section className="section">
					<div className="box-main">
						<div className="firstHalf">
							<h1>
								WellnessWizard's Slouch Stopper
							</h1>
							<p className="description">
								Add description on how that stuff works
							</p>
						</div>
					</div>
				</section>
				<div className="diagonal-line"></div>
				<section className="section">
					<div className="box-main">
						<div className="secondHalf">
							<h1>
								How to use it
							</h1>
							<p className="description">
								Description on how it can be used
							</p>
						</div>
					</div>
				</section>
			</div>
			

			<footer className="footer">
				<p className="text-footer">
					Copyright ©-All rights are reserved
				</p>
			</footer>
		</div>
	)
}

export default App
