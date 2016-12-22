'use strict';
import React from 'react';
import Home from './Home';
import NotifPage from './NotifPage';
import Error from './Error';
import Shortid from 'shortid';

export default class Site extends React.Component {
	render(){
		let urlid = this.props.splat;
		let page = null;

		if (urlid == '') {
			page = <Home />;
		}
		else if (Shortid.isValid(urlid)) {
			page = <NotifPage urlid={urlid} />;
		}
		else {
			page = <Error />;
		}

		return (
			<div>
				<div className="hero">
					<div className="title">
						<h1>Notify</h1>
					</div>
					<div className="tagline">
						Send a browser notification from your terminal. No installation.
					</div>
				</div>
				{page}
			</div>
		);
	}
}
