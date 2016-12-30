'use strict';
import React from 'react';

export default class Error extends React.Component {
	render(){
		return (
			<div className="container">
				<div className="row">
					<div className="twelve columns">
						<h4>Error</h4>
						<p>
							Something went wrong so we stopped everything and went fishing.
						</p>
						<video className="u-max-full-width" poster="https://i.imgur.com/vfcuwyah.jpg" preload="auto" autoPlay={true} muted="muted" loop="loop" webkit-playsinline="">
							<source src="https://i.imgur.com/vfcuwya.mp4" type="video/mp4" />
						</video>
					</div>
				</div>
			</div>
		);
	}
}
