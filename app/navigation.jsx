import React from 'react';
import { Link } from 'react-router-dom';

import Container from './components/layouts/container';
import Button from './components/button';

// eslint-disable-next-line react/prefer-stateless-function
export default class Navigation extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-inverse bg-inverse sticky-top">
				<Container>
					<div className="d-flex flex-row">
						<span className="navbar-brand">Chronos</span>
						<ul className="navbar-nav mr-auto">
							<li className="nav-item">
								<Link className="nav-link" to="/login">Login</Link>
							</li>
						</ul>
						<div className="form-inline">
							<Button color="secondary" onClick={() => alert('test')}>Logout</Button>
						</div>
					</div>
				</Container>
			</nav>
		);
	}
}
