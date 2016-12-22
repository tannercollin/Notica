import React from 'react';
import Router from 'react-router';
import routes from './routes';

Router.run( routes, Router.HistoryLocation, function( Handler ){
	React.render(
		React.createElement( Handler ),
		document.getElementById('root')
	);
});
