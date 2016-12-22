'use strict';
import React from 'react';
import Router, {Route, NotFoundRoute, DefaultRoute} from 'react-router';
import App from './App';
import Home from './ui/Home';

var routes = (
	<Route name="app" path="/" handler={ App } >
		<DefaultRoute name="home" handler={ Home } />
	</Route>
);

export default routes;
