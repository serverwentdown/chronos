import React from 'react';

import { Dropdown } from 'react-toolbox';

export default class PageLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			schools: [],
			school: null,
		};

		this.changeSchool = this.changeSchool.bind(this);

		this.fetchSchools();
	}

	async fetchSchools() {
		return fetch('/api/v1/schools')
		.then(data => data.json())
		.then((data) => {
			this.setState({
				schools: data.map(s => ({ value: s.id, label: s.name })),
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	changeSchool(school) {
		this.setState({
			school,
		});
		this.context.router.history.push(`/login/${school}`);
	}

	render() {
		return (
			<section style={{ padding: '1em', margin: '0 auto', maxWidth: '480px' }}>
				<h1>
					Login
				</h1>
				<Dropdown
					onChange={this.changeSchool}
					source={this.state.schools}
					value={this.state.school}
					label="School"
				/>
			</section>
		);
	}
}

PageLogin.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
};
