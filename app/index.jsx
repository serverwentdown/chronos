import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
import * as oidc from 'oidc-client';

import LayoutMain from './layouts/main';
import PageHome from './pages/home';
import PageLogin from './pages/login';
import PageLoginSchool from './pages/login_school';

ReactDOM.render(
	<Router>
		<LayoutMain>
			<Route exact path="/" component={PageHome} />
			<Route path="/login" component={PageLogin} />
			<Route path="/login/:id" component={PageLoginSchool} />
		</LayoutMain>
	</Router>,
	document.getElementById('root'),
);
