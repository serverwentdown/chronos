import React from 'react';

import { List, ListSubHeader, ListItem, ListDivider, FontIcon } from 'react-toolbox';
import moment from 'moment-timezone';

import AddEventDialog from '../components/addeventdialog';
import AddEventWeeklyDialog from '../components/addeventweeklydialog';

const getDay = d => 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')[d];

export default class PageGroup extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: props.match.params.id,
			group: {},
			addEventDialogActive: false,
			addEventWeeklyDialogActive: false,
		};

		this.showAddEventDialog = this.showAddEventDialog.bind(this);
		this.hideAddEventDialog = this.hideAddEventDialog.bind(this);
		this.showAddEventWeeklyDialog = this.showAddEventWeeklyDialog.bind(this);
		this.hideAddEventWeeklyDialog = this.hideAddEventWeeklyDialog.bind(this);

		this.fetchGroup(context); // TODO: split into three backend calls
	}

	async fetchGroup(context = this.context) {
		return fetch(`/api/v1/schools/${context.user.school}/groups/${this.state.id}`, {
			headers: {
				FakeAuth: true,
				FakeID: context.user.id,
			},
		})
		.then(data => data.json())
		.then((data) => {
			this.setState({
				group: data,
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	showAddEventDialog() {
		this.setState({
			addEventDialogActive: true,
		});
	}

	hideAddEventDialog() {
		this.setState({
			addEventDialogActive: false,
		});
	}

	showAddEventWeeklyDialog() {
		this.setState({
			addEventWeeklyDialogActive: true,
		});
	}

	hideAddEventWeeklyDialog() {
		this.setState({
			addEventWeeklyDialogActive: false,
		});
	}

	render() {
		return (
			<main>
				<h1>{this.state.group.name}</h1>
				<List
					selectable
					ripple
				>
					<ListSubHeader
						caption="One-time Events"
					/>
					{this.state.group.eventsOnce && this.state.group.eventsOnce.map(e => (
						<ListItem
							key={e.id}
							caption={e.name}
							legend={`${moment(e.start).format('dddd, MMMM Do YYYY, HH:mm')} to ${moment(e.end).format('MMMM Do, HH:mm')}`}
							rightActions={[
								<FontIcon key={0} value="delete" onClick={() => console.log('Hi')} />,
							]}
						/>
					))}
					<ListItem
						caption="Create a one-time event"
						leftIcon="add"
						onClick={this.showAddEventDialog}
					/>
					<ListDivider />
					<ListSubHeader
						caption="Weekly Events"
					/>
					{this.state.group.eventsWeekly && this.state.group.eventsWeekly.map(e => (
						<ListItem
							key={e.id}
							caption={e.name}
							legend={`${getDay(e.day)}, ${e.starttime.slice(0, -3)} to ${e.endtime.slice(0, -3)}`}
							rightActions={[
								<FontIcon key={0} value="delete" onClick={() => console.log('Hi')} />,
							]}
						/>
					))}
					<ListItem
						caption="Create a weekly event"
						leftIcon="add"
						onClick={this.showAddEventWeeklyDialog}
					/>
					<ListDivider />
					<ListSubHeader
						caption="Members"
					/>
					{this.state.group.members && this.state.group.members.map(m => (
						<ListItem
							key={m.id}
							caption={m.name}
						/>
					))}
				</List>
				<AddEventDialog
					group={this.state.id}
					active={this.state.addEventDialogActive}
					onCancel={this.hideAddEventDialog}
					onDone={this.fetchGroup}
					onEscKeyDown={this.hideAddEventDialog}
					onOverlayClick={this.hideAddEventDialog}
				/>
				<AddEventWeeklyDialog
					group={this.state.id}
					active={this.state.addEventWeeklyDialogActive}
					onCancel={this.hideAddEventWeeklyDialog}
					onDone={this.fetchGroup}
					onEscKeyDown={this.hideAddEventWeeklyDialog}
					onOverlayClick={this.hideAddEventWeeklyDialog}
				/>
			</main>
		);
	}
}

PageGroup.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};

PageGroup.propTypes = {
	match: React.PropTypes.shape({
		params: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};
