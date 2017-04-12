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
					<div
						style={{ fontSize: '1.2em' }}
					>
						{this.context.user.email ?
							<span>
								Hello, <span title={this.context.user.email}>{this.context.user.name}</span>!
							</span>
							:
							'Not logged in'
						}
					</div>
					<List
						selectable
						ripple
					>
						{this.context.user.email ?
						[
							<ListItem
								key={0}
								caption="Home"
								onClick={() => this.context.router.history.push('/')}
							/>,
							<ListItem
								key={1}
								caption="Groups"
								onClick={() => this.context.router.history.push('/groups')}
							/>,
						]
							:
							null
						}
						<ListItem
							caption="Help"
							onClick={() => {}}
						/>
						<ListItem
							caption="About"
							onClick={() => {}}
						/>
						<ListItem
							caption="GitHub"
							to="https://github.com/ambrosechua/chronos"
						/>
					</List>
				</NavDrawer>
				<Panel>
					<AppBar
						title="Chronos"
						leftIcon="menu"
						onLeftIconClick={this.toggleDrawerActive}
					>
						<Navigation
							type="horizontal"
						>
							{this.context.user.email ?
								<Link
									style={{ color: 'var(--color-dark-contrast)' }}
									label="Logout"
									onClick={() => this.context.router.history.push('/logout')}
								/>
								:
								<Link
									style={{ color: 'var(--color-dark-contrast)' }}
									label="Login"
									onClick={() => this.context.router.history.push('/login')}
								/>
							}
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
	token: React.PropTypes.string,
};

