import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Site from './ui/Site';

React.render((
	<Router history={browserHistory}>
		<Route path="/*" component={Site} />
	</Router>
), document.getElementById('root'));
