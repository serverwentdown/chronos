import React from 'react';

import { Dialog, Input, Dropdown, DatePicker, TimePicker } from 'react-toolbox';

export default class AddEventDialog extends React.Component {
	constructor(props) {
		super(props);
		const now = new Date();
		this.state = {
			group: null,
			name: '',
			start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8),
			end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10),
			groups: [
				{ value: 1, label: 'M17502' },
				{ value: 2, label: 'Infocomm Club' },
				{ value: 3, label: 'Youth Flying Club', disabled: true },
				{ value: 4, label: 'Engineering Intrest Group' },
			],
		};

		this.handleGroupChange = this.handleGroupChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleStartChange = this.handleStartChange.bind(this);
		this.handleEndChange = this.handleEndChange.bind(this);

		this.actions = [
			{ label: 'Cancel', onClick: this.props.onCancel, accent: true },
			{ label: 'Add', onClick: this.addEvent, accent: true },
		];

		// pull user groups, together with the relationship attribute role
		// put user groups into state.groups, disabling those not admin
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
};

AddEventDialog.contextTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};

