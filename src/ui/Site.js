'use strict';
import React from 'react';
import Home from './Home';
import NotifPage from './NotifPage';
import Error from './Error';
import Shortid from 'shortid';
import { Router, Route, Link } from 'react-router';

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
						<Link to={'/'}>
							Notica
						</Link>
					</div>
					<div className="tagline">
						Send a browser notification from your terminal. No installation. No registration.
					</div>
				</div>
				{page}
			</div>
		);
	}
}
