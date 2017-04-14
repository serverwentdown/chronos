import React from 'react';

import { Dialog, Input, Autocomplete, Dropdown } from 'react-toolbox';

export default class AddGroupDialog extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
			name: '',
			members: [],
			users: [],
			type: 'DEF',
			types: [ // TODO: define this by school
				{ value: 'DEF', label: 'Normal' },
				{ value: 'CCA', label: 'CCA' },
				{ value: 'MEN', label: 'Mentor Group' },
				{ value: 'ING', label: 'Intrest Group' },
			],
			mentor_level: 0, // TODO: parse from name
			mentor_year: new Date().getFullYear(),
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleMembersChange = this.handleMembersChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.fetchUsers = this.fetchUsers.bind(this);
		this.addGroup = this.addGroup.bind(this);

		this.actions = [
			{ label: 'Cancel', onClick: this.props.onCancel, accent: true },
			{ label: 'Ok', onClick: this.addGroup, accent: true },
		];

		this.fetchUsers(context);
	}

	fetchUsers(context) {
		const headers = new Headers();
		headers.append('FakeAuth', 'true');
		headers.append('FakeID', context.user.id);
		fetch(`/api/v1/schools/${context.user.school}/users`, {
			headers,
		})
		.then(data => data.json())
		.then((data) => {
			this.setState({
				users: data.reduce((a, u) => {
					const o = {};
					o[u.id] = u.name;
					return Object.assign(a, o);
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	addGroup() {
		const method = 'POST';
		const headers = new Headers();
		headers.append('FakeAuth', 'true');
		headers.append('FakeID', this.context.user.id);
		headers.append('Content-Type', 'application/json');
		const body = JSON.stringify({
			name: this.state.name,
			members: this.state.members,
			type: this.state.type,
			mentor_level: this.state.mentor_level,
			mentor_year: this.state.mentor_year,
		});
		fetch(`/api/v1/schools/${this.context.user.school}/groups`, {
			method, headers, body,
		})
		.then(() => {
			this.props.onDone();
		})
		.catch((err) => {
			console.error(err);
		});
	}

	handleNameChange(value) {
		this.setState({
			name: value,
		});
	}

	handleMembersChange(value) {
		this.setState({
			members: value,
		});
	}

	handleTypeChange(value) {
		this.setState({
			type: value,
		});
	}

	render() {
		// TODO: make scrollable
		return (
			<Dialog
				{...this.props}
				actions={this.actions}
				title="Create a new group"
			>
				<Input
					type="text"
					label="Name"
					value={this.state.name}
					required
					onChange={this.handleNameChange}
				/>
				<Autocomplete
					keepFocusOnChange
					direction="down"
					selectedPosition="below"
					type="text"
					label="Add member"
					hint="Start typing..."
					suggestionMatch="anywhere"
					source={this.state.users}
					value={this.state.members}
					onChange={this.handleMembersChange}
				/>
				<Dropdown
					auto
					source={this.state.types}
					value={this.state.type}
					onChange={this.handleTypeChange}
				/>
			</Dialog>
		);
	}
}

AddGroupDialog.propTypes = {
	onCancel: React.PropTypes.func.isRequired,
	onDone: React.PropTypes.func.isRequired,
};

AddGroupDialog.contextTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};
