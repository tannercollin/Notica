import React from 'react';
import Router, { RouteHandler } from 'react-router';

class App extends React.Component {
	constructor( props, context ) {
		super();
		this.publishRouter( context.router );
	}
	render() {
		return (
			<RouteHandler />
		);
	}
	publishRouter( router ){
		var routes = {};

		// Use route names as constants
		router.routes[0].childRoutes.forEach( function( r ){
			routes[ r.name ] = r.path;
		});

		// Render the router accessible without contexts
		Router.currentRouter = router;
		Router.routes = routes;
	}
}

App.contextTypes = {
	router: React.PropTypes.func
};

export default App;
