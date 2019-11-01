'use strict';
import React from 'react';
import io from 'socket.io-client';
import QRCode from 'qrcode.react';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			supported: false,
			registration: null,
			haveperm: false,
			connected: false,
			socket: io.connect(),
			storSupport: (typeof localStorage !== 'undefined'),
			alerts: new Array(),
		}
	}

	componentDidMount() {
		this.checksupport();
		this.checkperm();
		this.getAlerts();
		this.connect();
	}

	componentWillUnmount() {
		this.setState({socket: this.state.socket.removeAllListeners()});
	}

	connect() {
		let socket = this.state.socket;

		let room = this.props.id;

		socket.on('connect', () => {
			socket.emit('room', room);
			this.setState({connected: true});

			socket.on('disconnect', () => {
				this.setState({connected: false});
			});
		});

		socket.on('message', (data) => {
			this.sendNotification(data);
			this.addAlert(data);
		});
	}

	addAlert(data) {
		if (this.state.storSupport) {
			let alerts = this.state.alerts;
			alerts.unshift(data);
			localStorage.setItem('alerts', JSON.stringify(alerts));
			this.getAlerts();
		}
	}

	getAlerts() {
		if (this.state.storSupport) {
			let alerts = new Array();
			let alertsJson = localStorage.getItem('alerts');
			if (alertsJson != null) {
				alerts = JSON.parse(alertsJson);
			}
			this.setState({alerts: alerts});
		}
	}

	clearAlerts() {
		if (this.state.storSupport) {
			if (localStorage.getItem('alerts') != null) {
				localStorage.removeItem('alerts');
			}
			this.getAlerts();
		}
	}

	sendNotification(data) {
		let message = data || 'Received a notification!';

		let options = {
			body: title,
			icon: icon,
			iconUrl: icon,
			vibrate: [200, 100, 200]
		};

		if (this.state.registration) {
			this.state.registration.showNotification(message, options);
		} else {
			new Notification(message, options);
		}
	}

	checksupport() {
		let supported = ('Notification' in window);
		this.setState({supported: supported});
	}

	askperm() {
		if (this.state.supported) {
			Notification.requestPermission(permission => {
				this.checkperm();

				try {
					navigator.serviceWorker.register('/js/sw.js').then((reg) => {
						this.setState({registration: reg});
					});
				} catch (e) { // If we are on a browser without serviceWorker
					this.setState({registration: false});
				}
			});
		}
	}

	checkperm() {
		if (Notification.permission === 'granted') {
			this.setState({haveperm: true});
		}
		else {
			this.setState({haveperm: false});
		}
	}

	render(){
		const id = this.props.id;
		const storSupport = this.props.storSupport;
		const supported = this.state.supported;
		const haveperm = this.state.haveperm;
		const connected = this.state.connected;

		const port = location.port ? ':' + location.port : '';
		const url = location.protocol + '//' + location.hostname + '/?';
		const alerts = this.state.alerts.map((value,index) =>
			<li key={index}>{value}</li>
		);

		return (
			<div className="container">
				<div className="row">
					<div className="twelve columns">
						<h4>Status</h4>

						{ supported || <div className="error"><p>
							<i className="fa fa-times" aria-hidden="true"></i> This browser does not support desktop notifications.
						</p></div>}
						{ !haveperm && supported && <div>
							<p>
								Please give this site permission to display notifications.
							</p>
							<p>
								<a className="button" href="javascript:void(0)" onClick={() => this.askperm()}>
									Allow Notifications
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
				{!!alerts.length && <div className="row">
					<div className="twelve columns">
						<h4>Previous Notifications</h4>

						{ !storSupport && <div className="error"><p>
							<i className="fa fa-times" aria-hidden="true"></i>This browser does not support local storage so it is unable to save notifications.
						</p></div>}
						{ storSupport && <div>
							<div className="alerts">
								<ul>{alerts}</ul>
							</div>
							<p>
								<a className="button" href="javascript:void(0)" onClick={() => this.clearAlerts()}>Clear</a>
							</p>
						</div>}
					</div>
				</div>}
				<div className="row">
					<div className="twelve columns">
						<h4>Usage</h4>
						<p>
							Notica sends a notification to a tab in your browser when ran. It works over SSH and to your phone.
						</p>
					</div>
				</div>
				<div className="row">
					<div className="six columns">
						<p><code>$ long-running-command; notica Finished!</code></p>
						<p>
							This will wait until the first command completes before running Notica. You can go do things while your long task runs, then you will recieve a notification on any pages that have this website open.
						</p>
					</div>
					<div className="six columns">
						<p><img className="u-max-full-width" src="/img/example.gif" /></p>
					</div>
				</div>
				<div className="row">
					<div className="twelve columns">
						<h4>Quick Setup</h4>
						<p>
							Run this command: <br />
							<code>
								$ echo 'notica() &#123; curl --data "d:$*" "{url + id}" ; &#125;' >> ~/.bashrc && source ~/.bashrc
							</code>
						</p>
						<p>Now open this page on any devices you want to receive the notifications on: <a href={url + id} rel="nofollow">{url + id}</a></p>

						<h4>Setup</h4>
						<p>Curl is required to use Notica.</p>
						<p>
							Add this line to your <code className="smallcode">.bashrc</code> file:<br />
							<code>
								notica() &#123; curl --data "d:$*" "{url + id}" ; &#125;
							</code>
						</p>
						<p>
							Source your <code className="smallcode">.bashrc</code> file to apply the changes:<br />
							<code>$ source .bashrc</code>
						</p>
						<p>
							All done! Now open this page on any devices you want to receive the notifications on: <a href={url + id} rel="nofollow">{url + id}</a><br />
						</p>
						{ storSupport && <div className="storSupport"><p>
							<i className="fa fa-info-circle" aria-hidden="true"></i> Notica uses Local Storage to keep track of your unique ID. If you would like to generate a new random ID, <a href="/clear" rel="nofollow">click here</a>.
						</p></div>}
					</div>
				</div>
				<div className="row">
					<div className="six columns">
						<h4>Examples</h4>
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
						<p>Lose the link to this page? Just run Notica again: <br />
							<code style={{display: 'block'}}>
								$ notica <br />
								{url + id}
							</code>
						</p>
						<p>
							Use quotes on messages with special characters: <br />
							<code>
								$ notica "This is awesome :)"
							</code>
						</p>
						<p>
							Open this page on your phone:
							<center><QRCode value={url + id} /></center>
						</p>
					</div>
				</div>
				<div className="row">
					<div className="twelve columns">
						<h4>About</h4>
						<p>
							Notica was written by <a href="http://tannercollin.com" target="_blank">Tanner Collin</a> after he got tired of checking if his commands were done running.
						</p>
						<p>
							Notica is free and open-source software: <a href="https://github.com/tannercollin/Notica" target="_blank">https://github.com/tannercollin/Notica</a>
						</p>
						<p>
							Thanks to exdevlin for thinking of the name. Thanks to all the devs behind Node.js, React, webpack, and socket.io.
						</p>
					</div>
				</div>
			</div>
		);
	}
}
