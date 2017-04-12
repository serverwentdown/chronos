import React from 'react';

import { List, ListItem, Button } from 'react-toolbox';

import AddGroupDialog from '../components/addgroupdialog';

export default class PageGroups extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
			groups: [
				{ id: 0, name: 'Test' },
				{ id: 1, name: 'Test 2' },
				{ id: 2, name: 'Test 3' },
				{ id: 3, name: 'Test 4' },
			],
			addGroupDialogActive: false,
		};

		this.showAddGroupDialog = this.showAddGroupDialog.bind(this);
		this.hideAddGroupDialog = this.hideAddGroupDialog.bind(this);
		this.fetchGroups = this.fetchGroups.bind(this);

		this.fetchGroups(context);
	}

	async fetchGroups(context = this.context) {
		return fetch(`/api/v1/schools/${context.user.school}/users/${context.user.id}/groups`, {
			headers: {
				FakeAuth: true,
				FakeID: context.user.id,
			},
		})
		.then(data => data.json())
		.then((data) => {
			this.setState({
				groups: data,
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	showAddGroupDialog() {
		this.setState({
			addGroupDialogActive: true,
		});
	}

	hideAddGroupDialog() {
		this.setState({
			addGroupDialogActive: false,
		});
	}

	render() {
		return (
			<main>
				<List
					selectable
					ripple
				>
					{this.state.groups.map(group =>
						<ListItem
							key={group.id}
							caption={group.name}
							onClick={() => this.context.router.history.push(`/groups/${group.id}`)}
						/>,
					)}
				</List>
				<Button
					style={{ position: 'fixed', bottom: '1em', right: '1em' }}
					floating
					accent
					icon="add"
					onClick={this.showAddGroupDialog}
				/>
				<AddGroupDialog
					active={this.state.addGroupDialogActive}
					onCancel={this.hideAddGroupDialog}
					onEscKeyDown={this.hideAddGroupDialog}
					onOverlayClick={this.hideAddGroupDialog}
					onDone={() => { this.fetchGroups(); this.hideAddGroupDialog(); }}
				/>
			</main>
		);
	}
}

PageGroups.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
};

