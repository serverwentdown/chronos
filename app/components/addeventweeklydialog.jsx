import React from 'react';

import { Dialog, Input, Dropdown, TimePicker } from 'react-toolbox';

export default class AddEventWeeklyDialog extends React.Component {
	constructor(props, context) {
		super(props, context);
		const now = new Date();
		this.state = {
			group: parseInt(props.group, 10), // TODO: make ids type independent in code
			name: '',
			day: null,
			starttime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8),
			endtime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10),
			days: [
				{ value: 0, label: 'Sunday' },
				{ value: 1, label: 'Monday' },
				{ value: 2, label: 'Tuesday' },
				{ value: 3, label: 'Wednesday' },
				{ value: 4, label: 'Thursday' },
				{ value: 5, label: 'Friday' },
				{ value: 6, label: 'Saturday' },
			],
			groups: [],
		};

		this.handleGroupChange = this.handleGroupChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDayChange = this.handleDayChange.bind(this);
		this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
		this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
		this.addEvent = this.addEvent.bind(this);

		this.actions = [
			{ label: 'Cancel', onClick: this.props.onCancel, accent: true },
			{ label: 'Add', onClick: this.addEvent, accent: true },
		];

		this.fetchGroups(context);
	}

	fetchGroups(context = this.context) {
		return fetch(`/api/v1/schools/${context.user.school}/users/${context.user.id}/groups/`, {
			headers: {
				FakeAuth: true,
				FakeID: context.user.id,
			},
		})
		.then(data => data.json())
		.then((data) => {
			this.setState({
				groups: data.map(g => ({ value: g.id, label: g.name })),
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	addEvent() {
		const method = 'POST';
		const headers = new Headers();
		headers.append('FakeAuth', 'true');
		headers.append('FakeID', this.context.user.id);
		headers.append('Content-Type', 'application/json');
		const body = JSON.stringify({
			name: this.state.name,
			day: this.state.day,
			starttime: this.state.starttime,
			endtime: this.state.endtime,
		});
		fetch(`/api/v1/schools/${this.context.user.school}/groups/${this.state.group}/eventsWeekly/`, {
			method, headers, body,
		})
		.then(() => {
			this.props.onDone();
		})
		.catch((err) => {
			console.error(err);
		});
	}

	handleGroupChange(value) {
		this.setState({
			group: value,
		});
	}

	handleNameChange(value) {
		this.setState({
			name: value,
		});
	}

	handleDayChange(value) {
		this.setState({
			day: value,
		});
	}

	handleStartTimeChange(value) {
		this.setState({
			starttime: value,
		});
	}
	handleEndTimeChange(value) {
		this.setState({
			endtime: value,
		});
	}

	render() {
		return (
			<Dialog
				{...this.props}
				actions={this.actions}
				title="Create a weekly event"
			>
				<Dropdown
					auto
					label="Group"
					source={this.state.groups}
					value={this.state.group}
					required
					onChange={this.handleGroupChange}
				/>
				<Input
					type="text"
					label="Name"
					value={this.state.name}
					required
					onChange={this.handleNameChange}
				/>
				<Dropdown
					auto
					label="Day"
					source={this.state.days}
					value={this.state.day}
					required
					onChange={this.handleDayChange}
				/>
				<TimePicker
					label="Start Time"
					value={this.state.starttime}
					required
					onChange={this.handleStartTimeChange}
				/>
				<TimePicker
					label="End Time"
					value={this.state.endtime}
					required
					onChange={this.handleEndTimeChange}
				/>
			</Dialog>
		);
	}
}

AddEventWeeklyDialog.propTypes = {
	onCancel: React.PropTypes.func.isRequired,
	onDone: React.PropTypes.func.isRequired,
	group: React.PropTypes.string,
};

AddEventWeeklyDialog.defaultProps = {
	group: null,
};

AddEventWeeklyDialog.contextTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};

