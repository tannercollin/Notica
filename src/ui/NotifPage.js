'use strict';
import React from 'react';
import io from 'socket.io-client';

export default class NotifPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
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
			new Notification(
				data || 'Received a notification!',
				{
					body: 'Notification from Notica',
					badge: 'assets/img/icon.png',
					icon: 'assets/img/icon.png',
					image: 'assets/img/icon.png',
					vibrate: 200
				}
			);
		});
	}

	checksupport() {
		let supported = ('Notification' in window);
		this.setState({supported: supported});

		if (supported) {
			Notification.requestPermission(permission => {
				this.checkperm(permission);
			}.bind(this));
		}
	}

	checkperm(permission) {
		if (permission === 'granted') {
			this.setState({haveperm: true});
		}
	}

	render() {
		let supported = this.state.supported;
		let haveperm = this.state.haveperm;
		let connected = this.state.connected;

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
					</div>
				</div>
			</div>
		);
	}
}
