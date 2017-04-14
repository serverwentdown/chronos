import React from 'react';

import { List, ListSubHeader, ListItem } from 'react-toolbox';

export default class PageGroup extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: parseInt(props.match.params.id, 10),
			group: {},
			addGroupDialogActive: false,
		};

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
						/>
					))}
					{
					// TODO: cca schedule or class timetable
					}
				</List>
				<List>
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
