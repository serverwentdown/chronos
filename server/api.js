import { get } from 'https';
import Router from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

import { WebError, UnknownError, UnauthenticatedError, NotFoundError, InvalidCredentialsError, BadRequestError } from './errors';

import { computeOccurrences } from './utils';

export default class API {
	constructor(database) {
		this.database = database;

		// Binds
		this.auth = this.auth.bind(this);

		// Router

		this.router = Router({
			strict: true,
		});

		this.router.use(bodyParser.json());

		// Routes

		this.router.get('/', (req, res) => {
			res.end('API v1');
		});

		// Schools
		this.router.get('/schools/', (req, res, next) => {
			this.database.getSchools()
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.get('/schools/:school', (req, res, next) => {
			this.database.getSchoolWithAuth(req.params.school)
			.then((data) => {
				res.json(Object.assign(data, {
					auth: data.auth,
				}));
			})
			.catch(next);
		});
		this.router.get('/schools/:school/oid/.well-known/openid-configuration', (req, res, next) => {
			this.database.getSchoolWithAuth(req.params.school)
			.then((data) => {
				// assume auth[0] exists
				const url = data.auth[0].oid_meta;
				if (url) {
					get(url, (d) => {
						d.pipe(res);
					});
				}
			})
			.catch(next);
		});

		// Login
		this.router.post('/schools/:school/login', (req, res, next) => {
			this.checkLogin(req.params.school, req.body)
			.then((data) => {
				res.json(data);
				// TODO: generate and return token instead of user object
			})
			.catch(next);
		});

		// Users
		this.router.get('/schools/:school/users/', this.auth, (req, res, next) => {
			this.database.getUsers(req.params.school)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.get('/schools/:school/users/:id', this.auth, (req, res, next) => {
			this.database.getUser(req.params.school, req.params.id)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.get('/schools/:school/users/:id/groups', this.auth, (req, res, next) => {
			this.database.getUserGroups(req.params.school, req.params.id)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});

		// Groups
		this.router.get('/schools/:school/groups/', this.auth, (req, res, next) => {
			this.database.getGroups(req.params.school)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.post('/schools/:school/groups/', this.auth, (req, res, next) => {
			this.database.createGroup(req.params.school, req.body)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.get('/schools/:school/groups/:id', this.auth, (req, res, next) => {
			this.database.getGroup(req.params.school, req.params.id)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});

		// Events
		this.router.post('/schools/:school/groups/:group/eventsWeekly/', this.auth, (req, res, next) => {
			this.database.createEventWeekly(req.params.school, req.params.group, req.body)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.post('/schools/:school/groups/:group/eventsOnce/', this.auth, (req, res, next) => {
			this.database.createEventOnce(req.params.school, req.params.group, req.body)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});
		this.router.get('/schools/:school/groups/:group/eventsOnce/:id', this.auth, (req, res, next) => {
			this.database.getEventOnce(req.params.school, req.params.group, req.params.id)
			.then((data) => {
				res.json(data);
			})
			.catch(next);
		});

		this.router.get('/schools/:school/users/:id/events', this.auth, (req, res, next) => {
			this.database.getUserEventsBetween(
				req.params.school,
				req.params.id,
				req.query.start,
				req.query.end,
			)
			.then((data) => {
				const eventsWeekly = computeOccurrences(data.eventsWeekly, req.query.start, req.query.end);
				res.json(data.eventsOnce
						.map(e => Object.assign({ type: 'once' }, e))
						.concat(eventsWeekly)
							.map(e => Object.assign({ type: 'weekly' }, e)));
			})
			.catch(next);
		});

		this.router.use('/*', (req, res, next) => {
			next(new NotFoundError());
		});
		this.router.use(API.error);
	}

	auth(req, res, next) {
		// res.end('not implemented');
		if (this.validate(req.get('FakeAuth'))) {
			req.user = {
				id: req.get('FakeID'),
			};
			return next();
		}
		return next(new UnauthenticatedError());
	}

	// eslint-disable-next-line class-methods-use-this
	validate(token) {
		return !!token;
	}

	async checkLogin(school, options) {
		const checkLoginPassword = async () => {
			// TODO
			throw new InvalidCredentialsError('Not implemented');
		};
		const checkLoginToken = async (sch, token) => {
			const s = await this.database.getSchoolWithAuth(sch);
			const oidUrl = s.auth[0].oid_meta;
			if (!oidUrl) {
				throw new Error();
			}
			const o = await fetch(oidUrl).then(res => res.json());
			const jwksUrl = o.jwks_uri;
			const k = await fetch(jwksUrl).then(res => res.json());
			const keys = k.keys;
			const verified = keys.reduce((a, key) => {
				try {
					return jwt.verify(token, jwkToPem(key), {
						algorithms: ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'],
						//ignoreExpiration: true,
					});
				} catch (e) {
					return a;
				}
			}, null);
			if (!verified) {
				throw new InvalidCredentialsError('Token not verifiable');
			}
			return verified;
		};
		if (options.type === 'EMAIL') { // not used
			return this.database.getUserByEmail(school, options.email)
			.then(data => checkLoginPassword(data.pwd_hash, options.pwd) && data);
			// whoops, should have been sendAuthEmail
		} else if (options.type === 'OID') { // TODO: create user if user not found? no.
			return checkLoginToken(school, options.id_token)
			.then(data => this.database.getUserByEmail(school, data.upn));
		}
		return new BadRequestError();
	}

	// eslint-disable-next-line no-unused-vars
	static error(err, req, res, next) {
		if (err instanceof WebError) {
			err.responseTo(res);
		} else if (err) {
			console.error(err);
			new UnknownError().responseTo(res);
		}
		next();
	}
}
