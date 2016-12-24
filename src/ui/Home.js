'use strict';
import React from 'react';
import Shortid from 'shortid';

export default class Home extends React.Component {
	render(){
		let id = Shortid.generate();

		return (
			<div className="container">
				<div className="row">
					<div className="twelve columns">
						<h4>Usage</h4>
						<p>
							Notica is a Bash function / alias that will send a notification to a tab in your browser when it's ran:
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
						<p><img className="u-max-full-width" src="http://i.imgur.com/TNb5kRQ.gif" /></p>
					</div>
				</div>
				<div className="row">
					<div className="twelve columns">
						<h4>Setup</h4>
						<p>Curl is required to use Notica.</p>
						<p>Add this line to your <code>.bashrc</code> file:</p>
						<p>
							<code>
								notica() &#123; curl --data "$@" https://notica.us/{id} &#125;
							</code>
						</p>
						<p>Source your <code>.bashrc</code> file to apply the changes:</p>
						<p><code>$ source .bashrc</code></p>
						<p>Now, open this link in a new tab:</p>
						<p><a target="_blank" href={"https://notica.us/"+id}>https://notica.us/{id}</a></p>
						<p>All done! Bookmark that link so you can find it later since it's unique to you.</p>

						<h4>One-Line Setup</h4>
						<p>
							<code>
								$ echo 'notica() &#123; curl --data "$@" https://notica.us/{id} &#125;' >> ~/.bashrc && source ~/.bashrc
							</code>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
