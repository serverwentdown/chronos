import Router from 'express';
import { WebError, UnauthenticatedError } from './errors';

export default class API {
	constructor(database) {
		this.database = database;

		// Binds
		this.auth = this.auth.bind(this);

		this.router = Router({
			strict: true,
		});

		// Routes

		this.router.get('/', (req, res) => {
			res.end('API v1');
		});

		// Schools
		this.router.get('/schools/', (req, res, next) => {
			this.database.getSchools()
			.then((data) => {
				res.json(data);
			}).catch(next);
		});
		this.router.get('/schools/:school', (req, res, next) => {
			this.database.getSchool(req.params.school)
			.then((data) => {
				res.json(data);
			}).catch(next);
		});

		// Users
		this.router.get('/schools/:school/users/', this.auth, (req, res, next) => {
			this.database.getUsers(req.params.school)
			.then((data) => {
				res.json(data);
			}).catch(next);
		});
		this.router.get('/schools/:school/users/:id', this.auth, (req, res, next) => {
			this.database.getUser(req.params.school, req.params.id)
			.then((data) => {
				res.json(data);
			}).catch(next);
		});

		// this.router.all('/*', this.auth);
		this.router.use(API.error);
	}

	auth(req, res, next) {
		// res.end('not implemented');
		if (this.validate(req.get('FakeAuth'))) {
			return next();
		}
		return next(new UnauthenticatedError());
	}

	// eslint-disable-next-line class-methods-use-this
	validate(token) {
		return !!token;
	}

	// eslint-disable-next-line no-unused-vars
	static error(err, req, res, next) {
		if (err instanceof WebError) {
			err.responseTo(res);
		} else if (err) {
			console.error(err);
			res.status(500).json({
				error: 'Unknown error',
			});
		}
		next();
	}
}
