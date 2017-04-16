import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LayoutMain from '../layouts/main';
import PageHome from '../pages/home';
import PageLogin from '../pages/login';
import PageLoginSchool from '../pages/login_school';
import PageGroups from '../pages/groups';
import PageGroup from '../pages/group';
import PageEvent from '../pages/event';

export default class App extends React.Component {
	getChildContext() {
		let cb = () => {};
		let pN = () => {};
		let pP = () => {};
		return {
			user: {},
			token: null,
			tooling: {
				setToolbar: (o) => { cb(o); },
				setPaginatePrev: (f) => { pP = f; },
				setPaginateNext: (f) => { pN = f; },
				paginatePrev: () => { pP(); },
				paginateNext: () => { pN(); },
				onChange: (f) => { cb = f; },
			},
		};
	}

	render() {
		return (
			<Router>
				<LayoutMain>
					<Route exact path="/" component={PageHome} />
					<Route path="/login" component={PageLogin} />
					<Route exact path="/login/:id" component={PageLoginSchool} />
					<Route exact path="/groups" component={PageGroups} />
					<Route exact path="/groups/:id" component={PageGroup} />
					<Route exact path="/groups/:group/events/:id" component={PageEvent} />
				</LayoutMain>
			</Router>
		);
	}
}

App.childContextTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	tooling: React.PropTypes.object.isRequired,
};
