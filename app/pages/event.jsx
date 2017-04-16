import React from 'react';

import { List, ListSubHeader, ListItem, ListDivider, FontIcon } from 'react-toolbox';

export default class PageEvent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			group: props.match.params.group,
			id: props.match.params.id,
			event: {
				name: 'Event name',
				attachments: [
					{ id: 1, oid: '15310b96d210ab630f8d4dea3cda6e60c77a789a' },
					{ id: 2, oid: '3a8fa8ed9294aac827ecbc5bd2b0a8aba4373792' },
					{ id: 3, oid: '56930768d695303ade973f02bbcc304b5f441ea6' },
				],
				descriptions: [
					{ id: 0, text: 'This is a very long description' },
				],
			},
		};

		// this.fetchEvent(context);
	}

	async fetchEvent(context = this.context) {
		return fetch(`/api/v1/schools/${context.user.school}/groups${this.state.group}/eventsOnce/${this.state.id}`, {
			headers: {
				FakeAuth: true,
				FakeID: context.user.id,
			},
		})
		.then(data => data.json())
		.then((data) => {
			this.setState({
				event: data,
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	render() {
		return (
			<main>
				<h1>{this.state.event.name}</h1>
				<List
					selectable
					ripple
				>
					<ListSubHeader
						caption="Description"
					/>
					{this.state.event.descriptions && this.state.event.descriptions.map(d => (
						<ListItem
							key={d.id}
							caption={d.text}
							rightActions={[
								<FontIcon key={0} value="mode_edit" onClick={() => console.log('Hi')} />,
							]}
						/>
					))}
					<ListDivider />
					<ListSubHeader
						caption="Attachments"
					/>
					{this.state.event.attachments && this.state.event.attachments.map(a => (
						<ListItem
							key={a.id}
							caption={a.oid}
							legend={`/files/${a.oid}`}
							rightActions={[
								<FontIcon key={0} value="delete" onClick={() => console.log('Hi')} />,
							]}
						/>
					))}
					<ListItem
						caption="Upload an attachment"
						leftIcon="add"
						onClick={() => {}}
					/>
				</List>
			</main>
		);
	}
}

PageEvent.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};

PageEvent.propTypes = {
	match: React.PropTypes.shape({
		params: React.PropTypes.shape({
			group: React.PropTypes.string.isRequired,
			id: React.PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};
