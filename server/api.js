import Router from 'express';

export default class API {
	constructor() {
		this.router = Router({
			strict: true,
		});

		this.router.get('/', (req, res) => {
			res.end('API v1');
		});
	}
}
