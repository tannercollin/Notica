'use strict';
import React from 'react';

export default class NotifPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			haveperm: false
		}
	}

	checkperm(permission) {
		if (permission === 'granted') {
			this.setState({haveperm: true});
		}
	}

	render(){
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
						{ this.state.haveperm && supported && <p>
							This page is now monitoring for notifications.
						</p>}
					</div>
				</div>
			</div>
		);
	}
}
