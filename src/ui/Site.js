'use strict';
import React from 'react';
import Home from './Home';
import Error from './Error';
import Shortid from 'shortid';
import { Link, browserHistory } from 'react-router';

export default class Site extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: null,
			id: '',
			storSupport: (typeof localStorage !== 'undefined')
		}
	}

	componentWillMount() {
		this.setPage();
	}

	componentDidUpdate(prevProps) {
		let oldUrl = prevProps.params.splat;
		let newUrl = this.props.params.splat;
		if (newUrl !== oldUrl) this.setPage();
	}

	setId(url) {
		if (this.state.storSupport) {
			if (localStorage.getItem('id')) {
				this.state.id = url || localStorage.getItem('id');
			} else {
				this.state.id = url || Shortid.generate();
			}
			localStorage.setItem('id', this.state.id);
		} else {
			this.state.id = url || Shortid.generate();
		}
	}

	setPage() {
		let url = this.props.params.splat;

		if (url == 'clear') {
			localStorage.clear();
			url = '';
		}

		if (url == '') {
			this.setId();
			browserHistory.push('/' + this.state.id);
			this.state.page = <Home id={this.state.id} storSupport={this.state.storSupport} />;
		}
		else if (Shortid.isValid(url)) {
			this.setId(url);
			this.state.page = <Home id={this.state.id} storSupport={this.state.storSupport} />;
		}
		else {
			this.state.page = <Error />;
		}
	}

	render(){
		return (
			<div>
				<div className="hero">
					<div className="title">
						<Link to={'/' + this.state.id}>
							<img src="/img/logo.svg" />
							<span className="name">Notica</span>
						</Link>
					</div>
					<div className="tagline">
						Send browser notifications from your terminal. No installation. No registration.
					</div>
				</div>
				{this.state.page}
			</div>
		);
	}
}
