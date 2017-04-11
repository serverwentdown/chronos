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
			drawerActive: !this.state.drawerActive, // TODO: use function instead
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
						{this.context.user.email ?
							<span>
								Hello, <span title={this.context.user.email}>{this.context.user.name}</span>!
							</span> : 'Not logged in'}
					</div>
					<List selectable ripple>
						{this.context.user.email ? <ListItem caption="Home" onClick={() => this.context.router.history.push('/')} /> : null}
						{this.context.user.email ? <ListItem caption="Logout" /> : null}
						<ListItem caption="Help" />
						<ListItem caption="About" />
						<ListItem to="https://github.com/ambrosechua/chronos" caption="GitHub" />
					</List>
				</NavDrawer>
				<Panel>
					<AppBar title="Chronos" leftIcon="menu" onLeftIconClick={this.toggleDrawerActive}>
						<Navigation type="horizontal">
							<Link label="Login" onClick={() => this.context.router.history.push('/login')} style={{ color: 'var(--color-dark-contrast)' }} />
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
};

LayoutMain.propTypes = {
	children: React.PropTypes.node,
};

LayoutMain.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
};

