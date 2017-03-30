import React from 'react';

import { Layout, NavDrawer, Panel, AppBar, Navigation, Link, List, ListItem } from 'react-toolbox';

export default class LayoutMain extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerActive: false,
		};

		this.toggleDrawerActive = this.toggleDrawerActive.bind(this);
	}

	toggleDrawerActive() {
		this.setState({
			drawerActive: !this.state.drawerActive,
		});
	}

	render() {
		return (
			<Layout>
				<NavDrawer
					active={this.state.drawerActive}
					permanentAt="md"
					onOverlayClick={this.toggleDrawerActive}
				>
					<div style={{ fontSize: '1.2em' }}>
						{this.props.user ? `Hello, ${this.props.user.name}!` : 'Not logged in'}
					</div>
					<List selectable ripple>
						{this.props.user ? <ListItem caption="Home" onClick={() => this.context.router.history.push('/')} /> : null}
						{this.props.user ? <ListItem caption="Logout" /> : null}
						<ListItem caption="Help" />
						<ListItem caption="About" />
						<ListItem to="https://github.com/ambrosechua/chronos" caption="GitHub" />
					</List>
				</NavDrawer>
				<Panel>
					<AppBar title="Chronos" leftIcon="menu" onLeftIconClick={this.toggleDrawerActive}>
						<Navigation type="horizontal">
							<Link label="Inbox" icon="inbox" onClick={() => this.context.router.history.push('/login')} />
							<Link active label="Profile" icon="person" />
						</Navigation>
					</AppBar>
					{this.props.children}
				</Panel>
			</Layout>
		);
	}
}

LayoutMain.defaultProps = {
	children: null,
	user: null,
};

LayoutMain.propTypes = {
	children: React.PropTypes.node,
	user: React.PropTypes.shape({
		name: React.PropTypes.string,
	}),
};

LayoutMain.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
};

