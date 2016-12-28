'use strict';
import React from 'react';
import Home from './Home';
import NotifPage from './NotifPage';
import Error from './Error';
import Shortid from 'shortid';
import { Router, Route, Link } from 'react-router';

export default class Site extends React.Component {
	render(){
		let url = this.props.splat;
		let page = null;
		let id = '';

		if (url == '') {
			page = <Home />;
		}
		else if (url.substring(0, 4) == 'home') {
			id = url.substring(5);
			page = <Home urlid={id} />;
		}
		else if (Shortid.isValid(url)) {
			id = url;
			page = <NotifPage urlid={url} />;
		}
		else {
			page = <Error />;
		}

		return (
			<div>
				<div className="hero">
					<div className="title">
						<Link to={'/home/' + id}>
							<img src="/img/logo.svg" />
							<span className="name">Notica</span>
						</Link>
					</div>
					<div className="tagline">
						Send browser notifications from your terminal. No installation. No registration.
					</div>
				</div>
				{page}
			</div>
		);
	}
}
