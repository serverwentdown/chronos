export class WebError extends Error {
	responseTo(res) {
		return res.status(this.code).json(this.toJSON());
	}
	toJSON() {
		return {
			type: this.name,
			code: this.code,
			error: this.message,
		};
	}
}

export class NotFoundError extends WebError {
	constructor(noun = 'Resource') {
		super();
		this.name = this.constructor.name;
		this.message = `${noun} not found`;
		this.code = 404;
	}
	withNoun(noun) {
		this.message = `${noun} not found`;
		return this;
	}
}

export class UnauthenticatedError extends WebError {
	constructor() {
		super();
		this.name = this.constructor.name;
		this.message = 'User not authenticated';
		this.code = 403;
	}
}
