import React from 'react';

import { Dialog, Input, Dropdown, DatePicker, TimePicker } from 'react-toolbox';

export default class AddEventDialog extends React.Component {
	constructor(props, context) {
		super(props, context);
		const now = new Date();
		this.state = {
			group: null,
			name: '',
			start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8),
			end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10),
			groups: [],
		};

		this.handleGroupChange = this.handleGroupChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleStartChange = this.handleStartChange.bind(this);
		this.handleEndChange = this.handleEndChange.bind(this);
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
			start: this.state.start,
			end: this.state.end,
		});
		fetch(`/api/v1/schools/${this.context.user.school}/groups/${this.state.group}/eventsOnce/`, {
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

	handleStartChange(value) {
		this.setState(prev => ({
			start: value,
			end: new Date(
				value.getFullYear(),
				value.getMonth(),
				value.getDate(),
				prev.end.getHours(),
				prev.end.getMinutes(),
			),
		}));
	}
	handleEndChange(value) {
		this.setState({
			end: value,
		});
	}

	render() {
		return (
			<Dialog
				{...this.props}
				actions={this.actions}
				title="Create a one-time event"
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
				<DatePicker
					label="Start Date"
					minDate={new Date()}
					value={this.state.start}
					required
					onChange={this.handleStartChange}
				/>
				<TimePicker
					label="Start Time"
					value={this.state.start}
					required
					onChange={this.handleStartChange}
				/>
				<DatePicker
					label="End Date"
					minDate={
						new Date(
							this.state.start.getFullYear(),
							this.state.start.getMonth(),
							this.state.start.getDate(),
						)
					}
					value={this.state.end}
					required
					onChange={this.handleEndChange}
				/>
				<TimePicker
					label="End Time"
					value={this.state.end}
					required
					onChange={this.handleEndChange}
				/>
			</Dialog>
		);
	}
}

AddEventDialog.propTypes = {
	onCancel: React.PropTypes.func.isRequired,
	onDone: React.PropTypes.func.isRequired,
};

AddEventDialog.contextTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};

