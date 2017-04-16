import mysql from 'mysql';
import semver from 'semver';

import { fatal, getVersion, stripTimezone } from './utils';
import { NotFoundError, attachNoun } from './errors';

const DATABASE = 'chronos';

export default class Database {
	constructor(options) {
		this.connection = mysql.createConnection(options);
		this.connection.connect();

		this.checkAndMigrate();
	}

	async getSchools() {
		return this.query(`
			SELECT id, name, domain
			FROM school
		`);
	}
	async getSchoolWithAuth(id) {
		return this.query(`
			SELECT *
			FROM auth RIGHT JOIN school
			ON auth.school = school.id
			WHERE school.${isNaN(parseInt(id, 10)) ? 'domain' : 'id'}  = ?
		`, [id], {
			required: true,
		})
		.then(results => ({
			id: results[0].id,
			name: results[0].name,
			domain: results[0].domain,
			auth: results[0].type ? results.map(r => Object.assign(r, {
				school: undefined,
				name: undefined,
				domain: undefined,
			})) : [],
		}))
		.catch(attachNoun('School'));
	}

	// eslint-disable-next-line class-methods-use-this
	async getUsers(school) {
		return this.query(`
			SELECT id, name
			FROM user
			WHERE user.school = ?
		`, [school]);
	}
	async getUser(school, id) {
		return this.query(`
			SELECT *
			FROM user
			WHERE user.school = ?
			AND user.id = ?
		`, [school, id], {
			single: true,
		})
		.catch(attachNoun('User'));
	}
	async getUserByEmail(school, email) {
		// assumes unique email
		return this.query(`
			SELECT *
			FROM user
			WHERE user.school = ?
			AND user.email = ?
		`, [school, email], {
			single: true,
		})
		.catch(attachNoun('User'));
	}
	async getUserGroups(school, id) {
		return this.query(`
			SELECT group_.*
			FROM member, group_
			WHERE member.group_ = group_.id
			AND member.user = ?
		`, [id])
		.catch(attachNoun('Group'));
	}

	async getGroups(school) {
		return this.query(`
			SELECT group_.*
			FROM user, member, group_
			WHERE member.group_ = group_.id
			AND member.user = user.id
			AND user.school = ?
		`, [school]);
	}
	async createGroup(school, data) {
		console.log(data);
		const group = await this.query(`
			INSERT INTO group_ (name, type)
			VALUES (?, ?)
		`, [data.name, data.type]);
		if (data.type === 'MEN') {
			await this.query(`
				INSERT INTO group_mentor (id, level, year)
				VALUES (?, ?, ?)
			`, [group.insertId, data.mentor_level, data.mentor_year]);
		}
		const insertMember = u => this.query(`
			INSERT INTO member (user, group_)
			VALUES (?, ?)
		`, [u, group.insertId]);
		return Promise.all(data.members.map(insertMember));
	}
	async getGroup(school, id) {
		const getGroup = this.query(`
			SELECT *
			FROM group_
			WHERE group_.id = ?
		`, [id], {
			required: true,
			single: true,
		}).catch(attachNoun('Group'));
		const getMembers = this.query(`
			SELECT user.*
			FROM member, user
			WHERE member.user = user.id
			AND member.group_ = ?
		`, [id]);
		const getEventsOnce = this.query(`
			SELECT *
			FROM event_once
			WHERE event_once.group_ = ?
		`, [id]);
		const getEventsWeekly = this.query(`
			SELECT *
			FROM event_weekly
			WHERE event_weekly.group_ = ?
		`, [id]);
		return Promise.all([getGroup, getMembers, getEventsOnce, getEventsWeekly])
		.then(results => Object.assign({}, results[0], {
			members: results[1].map(m => Object.assign(m, {
				pwd_hash: undefined,
				oid_id: undefined,
			})),
			eventsOnce: results[2],
			eventsWeekly: results[3],
		}));
	}

	async createEventWeekly(school, group, data) {
		console.log(data.starttime);
		return this.query(`
			INSERT INTO event_weekly (group_, name, day, starttime, endtime)
			VALUES (?, ?, ?, ?, ?)
		`, [group, data.name, data.day, stripTimezone(data.starttime), stripTimezone(data.endtime)]);
	}

	async createEventOnce(school, group, data) {
		console.log(data.starttime);
		return this.query(`
			INSERT INTO event_once (group_, name, start, end)
			VALUES (?, ?, ?, ?)
		`, [group, data.name, stripTimezone(data.start), stripTimezone(data.end)]);
	}
	async getEventOnce(school, group, id) {
		return this.query(`
			SELECT *
			FROM event_once
			WHERE event_once.group_ = ?
			AND event_once.id = ?
		`, [group, id]);
	}

	// eslint-disable-next-line
	async getEventClashesWith(school, group, id) {
		// TODO
	}

	async getUserEventsBetween(school, user, start, end) {
		// oh shit
		const getEventsOnce = this.query(`
			SELECT event_once.*
			FROM member, event_once
			WHERE member.group_ = event_once.group_
			AND member.user = ?

			AND (
			(event_once.start >= ? AND event_once.start <= ?)
			OR
			(event_once.end >= ? AND event_once.end <= ?)
			)
		`, [user, stripTimezone(start), stripTimezone(end), stripTimezone(start), stripTimezone(end)]);
		const getEventsWeekly = this.query(`
			SELECT event_weekly.*
			FROM member, event_weekly
			WHERE member.group_ = event_weekly.group_
			AND member.user = ?
		`, [user]);
		return Promise.all([getEventsOnce, getEventsWeekly])
		.then(results => ({ eventsOnce: results[0], eventsWeekly: results[1] }));
	}

	query(query, values, options = {}) {
		console.log('QUERY:', query.replace(/[\n\t]+/g, ' ').replace(/^ /g, '').replace(/ $/g, ''));
		return new Promise((resolve, reject) => {
			this.connection.query(query, values, (err, results, fields) => {
				if (err) {
					reject(err);
				} else if ((options.required || options.single) && results.length < 1) {
					reject(new NotFoundError());
				}
				if (options.single) {
					resolve(results[0], fields);
				} else {
					resolve(results, fields);
				}
			});
		});
	}

	async checkAndMigrate() {
		return this.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`)
		.then(() => this.query(`USE ${DATABASE}`))
		.then(() => this.query('SELECT * FROM options WHERE option = ?', ['VERSION'])
			.then(result => this.migrate(result[0] ? result[0].value : null))
			.catch(() => this.migrate()))
		.catch(err => fatal(err));
	}

	async migrate(oldVersion) {
		if (semver.satisfies(oldVersion, '~1')) {
			// database is up-to-date
			return true;
		} else if (semver.satisfies(oldVersion, '~0')) { // lmao forces database migration
			return true;
			// database needs to be updated
			// return this.query(`DROP DATABASE ${DATABASE}`)
			// .then(() => this.checkAndMigrate());
		}
		// database does not exist

		// create tables
		const tables = [
			`CREATE TABLE options (
				option		VARCHAR(12) NOT NULL,
				value		VARCHAR(64) NOT NULL,
				PRIMARY KEY (option)
			)`,
			`CREATE TABLE school (
				id			INT NOT NULL AUTO_INCREMENT,
				name		VARCHAR(64) NOT NULL,
				domain		VARCHAR(32),
				PRIMARY KEY (id)
			)`,
			`CREATE TABLE auth (
				school		INT NOT NULL,
				id			INT NOT NULL,
				type		CHAR(3) NOT NULL,
				oid_meta	VARCHAR(128),
				oid_cid		VARCHAR(64),
				oid_csecret	VARCHAR(64),
				PRIMARY KEY (school, id),
				FOREIGN KEY (school) REFERENCES school(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE holiday (
				id			INT NOT NULL AUTO_INCREMENT,
				name		VARCHAR(64)	NOT NULL,
				start		DATETIME NOT NULL,
				end			DATETIME NOT NULL,
				PRIMARY KEY (id)
			)`,
			`CREATE TABLE observes (
				school		INT NOT NULL,
				holiday		INT NOT NULL,
				FOREIGN KEY (school) REFERENCES school(id) ON DELETE CASCADE ON UPDATE CASCADE,
				FOREIGN KEY (holiday) REFERENCES holiday(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE user (
				school		INT NOT NULL,
				id			INT	AUTO_INCREMENT NOT NULL,
				name		VARCHAR(64),
				email		VARCHAR(64),
				oid_id		VARCHAR(64),
				pwd_hash	VARCHAR(64),
				role		CHAR(3),
				PRIMARY KEY (id),
				FOREIGN KEY (school) REFERENCES school(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE group_ (
				id			INT	AUTO_INCREMENT NOT NULL,
				name		VARCHAR(64) NOT NULL,
				type		CHAR(3),
				PRIMARY KEY (id)
			)`,
			`CREATE TABLE group_mentor (
				id			INT	NOT NULL,
				level		TINYINT NOT NULL,
				year		YEAR(4) NOT NULL,
				PRIMARY KEY (id),
				FOREIGN KEY (id) REFERENCES group_(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE member (
				user		INT NOT NULL,
				group_		INT NOT NULL,
				FOREIGN KEY (user) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
				FOREIGN KEY (group_) REFERENCES group_(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE event_once (
				group_		INT NOT NULL,
				id			INT	AUTO_INCREMENT NOT NULL,
				name		VARCHAR(64) NOT NULL,
				start		DATETIME NOT NULL,
				end			DATETIME NOT NULL,
				PRIMARY KEY (id),
				FOREIGN KEY (group_) REFERENCES group_(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE attachment (
				event_once	INT NOT NULL,
				id			INT NOT NULL,
				PRIMARY KEY (event_once, id),
				FOREIGN KEY (event_once) REFERENCES event_once(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE event_weekly (
				group_		INT NOT NULL,
				id			INT	AUTO_INCREMENT NOT NULL,
				name		VARCHAR(64) NOT NULL,
				day			TINYINT NOT NULL,
				starttime	TIME NOT NULL,
				endtime		TIME NOT NULL,
				PRIMARY KEY (id),
				FOREIGN KEY (group_) REFERENCES group_(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			`CREATE TABLE ignored (	
				user		INT NOT NULL,
				event_weekly	INT NOT NULL,
				FOREIGN KEY (user) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
				FOREIGN KEY (event_weekly) REFERENCES event_weekly(id) ON DELETE CASCADE ON UPDATE CASCADE
			)`,
		];
		for (let i = 0; i < tables.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await this.query(tables[i]);
		}

		// set version number
		await this.query(`
			INSERT INTO options (option, value)
			VALUES ('version', '${getVersion()}')
		`);

		// TODO: Build admin interface to add schools and school owner
		// add first school
		const firstSchool = await this.query(`
			INSERT INTO school (name, domain)
			VALUES (?, ?)
		`, ['NUS High School', 'nushigh.edu.sg']);
		await this.query(`
			INSERT INTO user (school, name, email, pwd_hash, role)
			VALUES (?, ?, ?, ?, ?)
		`, [firstSchool.insertId, 'Ambrose Chua', 'h1310031@nushigh.edu.sg', '', 'OWN']);

		// eslint-disable-next-line global-require
		const fs = require('fs');
		const tmpsettings = JSON.parse(fs.readFileSync('oid_settings.json', 'utf8'));
		await this.query(`
			INSERT INTO auth (school, type, oid_meta, oid_cid, oid_csecret)
			VALUES (?, ?, ?, ?, ?)
		`, [firstSchool.insertId, 'OID', tmpsettings.oid_meta, tmpsettings.oid_cid, tmpsettings.oid_csecret]);

		return true;
	}
}
