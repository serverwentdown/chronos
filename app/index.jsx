import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './navigation';
import PageLogin from './pages/login';
import PageMain from './pages/main';

ReactDOM.render(
	<Router>
		<div>
			<Navigation />
			<Route exact path="/" component={PageMain} />
			<Route path="/login" component={PageLogin} />
		</div>
	</Router>,
	document.getElementById('root'),
);
