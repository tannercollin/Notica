'use strict';
import React from 'react';
import Router, {Route, NotFoundRoute, DefaultRoute} from 'react-router';
import App from './App';
import Site from './ui/Site';

var routes = (
	<Route name="app" path="/*" handler={ App } >
		<DefaultRoute name="site" handler={ Site } />
	</Route>
);

export default routes;
