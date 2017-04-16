import React from 'react';

import { Layout, NavDrawer, Panel, AppBar, Navigation, Link, List, ListItem } from 'react-toolbox';

export default class LayoutMain extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			drawerActive: false,
			title: 'Chronos',
			showPagination: false,
		};
		this.context = context;

		// eslint-disable-next-line no-param-reassign
		this.context.tooling.onChange(this.setToolbar.bind(this));
		this.paginatePrev = this.paginatePrev.bind(this);
		this.paginateNext = this.paginateNext.bind(this);

		this.toggleDrawerActive = this.toggleDrawerActive.bind(this);
	}

	setToolbar(o) {
		this.setState({
			title: o.title || 'Chronos',
			showPagination: o.showPagination,
		});
	}

	paginatePrev() {
		this.context.tooling.paginatePrev();
	}
	paginateNext() {
		this.context.tooling.paginateNext();
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
					<p>
						Thanks to @Enigmatrix for showing me react-big-calendar
					</p>
				</NavDrawer>
				<Panel>
					<AppBar
						title={this.state.title}
						leftIcon="menu"
						onLeftIconClick={this.toggleDrawerActive}
					>
						<Navigation
							type="horizontal"
						>
							{this.state.showPagination &&
								<Link
									style={{ color: 'var(--color-dark-contrast)' }}
									icon="navigate_before"
									onClick={this.paginatePrev}
								/>
							}
							{this.state.showPagination &&
								<Link
									style={{ color: 'var(--color-dark-contrast)' }}
									icon="navigate_next"
									onClick={this.paginateNext}
								/>
							}
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
	// eslint-disable-next-line react/forbid-prop-types
	tooling: React.PropTypes.object.isRequired,
};

