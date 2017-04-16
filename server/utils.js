import moment from 'moment-timezone';

export function getVersion() {
	if (process.env.npm_package_version) {
		return process.env.npm_package_version;
	}
	throw new Error('Unable to obtain running version');
}

export function fatal(e) {
	console.error(e);
	process.exit(1);
}

export function stripTimezone(date) {
	// TODO:
	// move timezone fixes to client side,
	// let client send dates and times as strings to be directly stored into database
	const d = new Date(date);
	if (isNaN(d.getTime())) {
		return new Date(parseInt(date, 10));
	}
	return d;
}

export function computeOccurrences(events, startd, endd) {
	const SECONDS_IN_WEEK = 7 * 24 * 60 * 60;

	const start = moment(stripTimezone(startd)).tz('Asia/Singapore');
	const end = moment(stripTimezone(endd)).tz('Asia/Singapore');
	const eventsOccurrences = [];

	const secondsToPreviousStartOfWeek =
		-(
		(start.day() * 24 * 60 * 60) +
		(start.hour() * 60 * 60) +
		(start.minute() * 60) +
		(start.second())
		);

	const secondsToEnd =
		moment(end).unix() -
		moment(start).unix();

	const secondsToNextOccurrence = events.map((e) => {
		const startT = e.starttime.split(':').map(c => parseInt(c, 10));
		const endT = e.endtime.split(':').map(c => parseInt(c, 10));
		const nextStart =
			(e.day * 24 * 60 * 60) +
			(startT[0] * 60 * 60) +
			(startT[1] * 60) +
			(startT[2]) +
			secondsToPreviousStartOfWeek;
		const nextEnd =
			(e.day * 24 * 60 * 60) +
			(endT[0] * 60 * 60) +
			(endT[1] * 60) +
			(endT[2]) +
			secondsToPreviousStartOfWeek;
		return {
			start: nextStart,
			end: nextEnd,
		};
	});

	secondsToNextOccurrence.forEach((o) => {
		while (o.end < 0) {
			// eslint-disable-next-line no-param-reassign
			o.start += SECONDS_IN_WEEK;
			// eslint-disable-next-line no-param-reassign
			o.end += SECONDS_IN_WEEK;
		}
	});

	secondsToNextOccurrence.forEach((o, i) => {
		while (o.start < secondsToEnd) {
			const nextStart = moment(start).add(o.start, 'seconds');
			const nextEnd = moment(start).add(o.end, 'seconds');

			eventsOccurrences.push(Object.assign({}, events[i], {
				start: nextStart,
				end: nextEnd,
			}));

			// eslint-disable-next-line no-param-reassign
			o.start += SECONDS_IN_WEEK;
			// eslint-disable-next-line no-param-reassign
			o.end += SECONDS_IN_WEEK;
		}
	});

	return eventsOccurrences;
}
