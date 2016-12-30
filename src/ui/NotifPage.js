'use strict';
import React from 'react';
import io from 'socket.io-client';
import { Router, Route, Link } from 'react-router';
import QRCode from 'qrcode.react';

export default class NotifPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			supported: false,
			registration: null,
			haveperm: false,
			connected: false,
			socket: io.connect()
		}
	}

	componentDidMount() {
		this.connect();
		this.checksupport();
	}

	componentWillUnmount() {
		this.setState({socket: this.state.socket.removeAllListeners()});
	}

	connect() {
		let socket = this.state.socket;

		let room = this.props.urlid;

		socket.on('connect', () => {
			socket.emit('room', room);
			this.setState({connected: true});

			socket.on('disconnect', () => {
				this.setState({connected: false});
			});
		});

		socket.on('message', (data) => {
			console.log("Notification: " + data);
			this.sendNotification(data);
		});
	}

	sendNotification(data) {
		let title = data || 'Received a notification!';

		let options = {
			body: 'Notification from Notica',
			icon: 'img/icon.png',
			iconUrl: 'img/icon.png',
			vibrate: [200, 100, 200]
		};

		if (this.state.registration) {
			console.log(this.state.registration.showNotification(title, options));
		} else {
			console.log(new Notification(title, options));
		}
	}

	checksupport() {
		let supported = ('Notification' in window);
		this.setState({supported: supported});

		if (supported) {
			Notification.requestPermission(permission => {
				this.checkperm(permission);

				try {
					navigator.serviceWorker.register('/js/sw.js').then((reg) => {
						this.setState({registration: reg});
					});
				} catch (e) { // If we are on a browser without serviceWorker
					this.setState({registration: false});
				}
			}.bind(this));
		}
	}

	checkperm(permission) {
		if (permission === 'granted') {
			this.setState({haveperm: true});
		}
		else {
			this.setState({haveperm: false});
		}
	}

	render() {
		let supported = this.state.supported;
		let haveperm = this.state.haveperm;
		let connected = this.state.connected;
		let urlid = this.props.urlid;

		return (
			<div className="container">
				<div className="row">
					<div className="twelve columns">
						<h4>Notification Page</h4>
						{ supported || <div className="error"><p>
							<i className="fa fa-times" aria-hidden="true"></i> This browser does not support desktop notifications.
						</p></div>}
						{ !haveperm && supported && <div>
							<p>
								Please give this site permission to display notifications.
								<br />
								<a className="button" href="#" onClick={() => this.checkperm(Notification.permission)}>
									Check Again
								</a>
							</p>
						</div>}
						{ !connected && supported && <div className="error">
							<p>
								<i className="fa fa-times" aria-hidden="true"></i> Unable to connect to the Notica server.
								<br />
								Attempting to reconnect...
							</p>
						</div>}
						{ haveperm && connected && supported && <p>
							<i className="fa fa-check" aria-hidden="true"></i> This page is monitoring for notifications.
						</p>}
					</div>
				</div>
				<div className="row">
					<div className="six columns">
						<h4>Usage</h4>
						<p>Here are some different ways to use Notica:</p>
						<p>
							Just run it from your terminal: <br />
							<code>
								$ notica
							</code>
						</p>
						<p>
							Add a custom message: <br />
							<code>
								$ notica Hello world!
							</code>
						</p>
						<p>
							Get an alert when a command finishes: <br />
							<code>
								$ sudo apt-get update; notica Done!
							</code>
						</p>
						<p>
							Get an alert when a command succeeds: <br />
							<code>
								$ make all && notica Success!
							</code>
						</p>
						<p>
							Get an alert when a command fails: <br />
							<code>
								$ make all || notica Failed!
							</code>
						</p>
					</div>
					<div className="six columns">
						<h4>Tips</h4>
						<p>Bookmark this page! It is unique to the function in your <code className="smallcode">.bashrc</code> file.
						Notifications will be sent to all open pages with the same ID code in the URL.</p>
						<p>
							Use quotes on messages with special characters: <br />
							<code>
								$ notica "This is awesome :)"
							</code>
						</p>
						<p>
							Need to set Notica up again? <br />
							<Link to={'/home/' + urlid}>
								Click here to go back to the instructions.
							</Link>
						</p>
						<p>
							Open this page on your phone:
							<center><QRCode value={'https://notica.us/' + urlid} /></center>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
