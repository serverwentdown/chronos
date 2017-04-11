import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LayoutMain from '../layouts/main';
import PageHome from '../pages/home';
import PageLogin from '../pages/login';
import PageLoginSchool from '../pages/login_school';

export default class App extends React.Component {
	getChildContext() {
		return {
			user: {},
			token: null,
		};
	}

	render() {
		return (
			<Router>
				<LayoutMain>
					<Route exact path="/" component={PageHome} />
					<Route path="/login" component={PageLogin} />
					<Route path="/login/:id" component={PageLoginSchool} />
				</LayoutMain>
			</Router>
		);
	}
}

App.childContextTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};
