'use strict';
import React from 'react';
import io from 'socket.io-client';

export default class NotifPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			haveperm: false,
			connected: false
		}
	}

	componentDidMount() {
		this.connect();
	}

	connect() {
		let socket = io.connect();

		let room = this.props.urlid;

		socket.on('connect', () => {
			socket.emit('room', room);
			this.setState({connected: true});

			socket.on('disconnect', () => {
				this.setState({connected: false});
			});
		});

		socket.on('message', (data) => {
			new Notification(data);
		});
	}

	checkperm(permission) {
		if (permission === 'granted') {
			this.setState({haveperm: true});
		}
	}

	render() {
		let supported = ("Notification" in window);

		if (supported) {
			Notification.requestPermission(permission => {
				this.checkperm(permission);
			}.bind(this));
		}

		return (
			<div className="container">
				<div className="row">
					<div className="twelve columns">
						<h4>Notification Page</h4>
						{ supported || <div className="error"><p>
							Error: This browser does not support desktop notifications :(
						</p></div>}
						{ !this.state.haveperm && supported && <div>
							<p>
								Please give this site permission to display notifications.
							</p>
							<a className="button" href="#" onClick={() => this.checkperm(Notification.permission)}>
								Check Again
							</a>
						</div>}
						{ !this.state.connected && supported && <div className="error">
							<p>
								Error: Unable to connect to the Notica server :(
							</p>
							<p>
								Attempting to reconnect...
							</p>
						</div>}
						{ this.state.haveperm && this.state.connected && supported && <p>
							This page is monitoring for notifications.
						</p>}
					</div>
				</div>
			</div>
		);
	}
}
