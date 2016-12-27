'use strict';
import React from 'react';
import Shortid from 'shortid';
import { Router, Route, Link } from 'react-router';

export default class Home extends React.Component {
	render(){
		let id = Shortid.generate();

		return (
			<div className="container">
				<div className="row">
					<div className="twelve columns">
						<h4>Usage</h4>
						<p>
							Notica is a Bash function / alias that sends a notification to a tab in your browser when it's ran:
						</p>
					</div>
				</div>
				<div className="row">
					<div className="six columns">
						<p><code>$ make all; notica Code is done compiling!</code></p>
						<p>
							This will wait until the first command completes before running Notica. That way you can go do other things while your long task runs. Then you will recieve a notification.
						</p>
					</div>
					<div className="six columns">
						<p><img className="u-max-full-width" src="https://i.imgur.com/TNb5kRQ.gif" /></p>
					</div>
				</div>
				<div className="row">
					<div className="twelve columns">
						<h4>Setup</h4>
						<p>Curl is required to use Notica.</p>
						<p>
							Add this line to your <code className="smallcode">.bashrc</code> file:<br />
							<code>
								notica() &#123; curl --data "d:$@" https://notica.us/{id}; &#125;
							</code>
						</p>
						<p>
							Source your <code className="smallcode">.bashrc</code> file to apply the changes:<br />
							<code>$ source .bashrc</code>
						</p>
						<p>
							All done! Now go to this link (bookmark it since it's yours): <br />
							<Link to={'/' + id}>https://notica.us/{id}</Link>
						</p>

						<h4>Quick Setup</h4>
						<p>
							Run this command: <br />
							<code>
								$ echo 'notica() &#123; curl --data "d:$@" https://notica.us/{id}; &#125;' >> ~/.bashrc && source ~/.bashrc
							</code>
						</p>
						<p>Go to this link to receive your notifications (bookmark it since it's yours): <Link to={'/' + id}>https://notica.us/{id}</Link></p>
					</div>
				</div>
			</div>
		);
	}
}
