import React from 'react';

import { Input, Button, Snackbar } from 'react-toolbox';

import { UserManager } from 'oidc-client';

const getParams = (query) => {
	if (!query) {
		return {};
	}

	return (/^[?#]/.test(query) ? query.slice(1) : query)
		.split('&')
		.reduce((params, param) => {
			const [key, value] = param.split('=');
			const obj = {};
			obj[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
			return Object.assign(params, obj);
		}, {});
};

// eslint-disable-next-line react/prefer-stateless-function
export default class PageLoginSchool extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: parseInt(props.match.params.id, 10),
			school: {},
			openId: false,
			email: true,
			snackbarActive: false,
		};

		this.loginOpenId = this.loginOpenId.bind(this);
		this.loginEmail = this.loginEmail.bind(this);

		this.fetchSchool().then(() => {
			if (this.state.openId) {
				this.userManager = new UserManager({
					authority: `/api/v1/schools/${this.state.school.id}/oid`, // temp bypass: this.state.school.auth[0].oid_meta,
					client_id: this.state.school.auth[0].oid_cid,
					redirect_uri: `${window.location.origin}/login/${this.state.school.id}`,
				});
				const params = getParams(window.location.hash);
				if (params.id_token) {
					// TODO: check auth by sending request to server
					// TODO: auth endpoint should return user information
					// TODO: use user information here:
					const method = 'POST';
					const headers = new Headers();
					headers.append('Content-Type', 'application/json');
					const body = JSON.stringify({
						type: 'OID',
						id_token: params.id_token,
					});
					fetch(`/api/v1/schools/${this.state.school.id}/login`, {
						method,	headers, body,
					}).then(async (response) => {
						if (response.ok) {
							Object.assign(this.context.user, await response.json());
							this.context.router.history.push('/');
						} else {
							console.error(await response.json());
							// TODO
						}
					}).catch((e) => {
						// TODO
						console.error(e);
					});
				}
			}
		});
	}

	async fetchSchool() {
		return fetch(`/api/v1/schools/${this.state.id}`)
		.then(data => data.json())
		.then((data) => {
			this.setState({
				school: data,
				openId: !!data.auth[0],
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}

	loginOpenId() {
		this.userManager.signinRedirect();
	}

	// eslint-disable-next-line class-methods-use-this
	loginEmail() {
		console.error('Not implemented');
	}

	handleSnackbarTimeout() {
		this.setState({ snackbarActive: false });
	}

	render() {
		return (
			<section style={{ padding: '1em', margin: '0 auto', maxWidth: '480px' }}>
				{this.state.openId &&
					<Button
						onClick={this.loginOpenId}
						icon="fingerprint"
						label="Authenticate with Office365"
						raised primary style={{ width: '100%' }}
					/>
				}
				{this.state.openId && this.state.email &&
					<div style={{ textAlign: 'center', margin: '1rem 0 0 0' }}>
						OR
					</div>
				}
				{this.state.email &&
					<div>
						<Input
							type="email"
							label="Email"
						/>
						<Button
							onClick={this.loginEmail}
							label="Authenticate with email"
							raised primary style={{ width: '100%' }}
						/>
						<Snackbar
							onTimeout={this.state.handleSnackbarTimeout}
							active={this.state.snackbarActive}
							timeout={2000}
							label="Not implemented"
							type="accept"
						/>
					</div>
				}
			</section>
		);
	}
}

PageLoginSchool.propTypes = {
	match: React.PropTypes.shape({
		params: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};

PageLoginSchool.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
};
