import mysql from 'mysql';
import { fatal, getVersion } from './utils';

const DATABASE = 'chronos';

export default class Database {
	constructor(options) {
		this.connection = mysql.createConnection(options);
		this.connection.connect();

		this.checkAndMigrate();
	}

	query(query, values) {
		console.log('QUERY:', query);
		return new Promise((resolve, reject) => {
			this.connection.query(query, values, (err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results, fields);
			});
		});
	}

	checkAndMigrate() {
		this.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`, [])
		.then(() => this.query(`USE ${DATABASE}`, []))
		.then(() => this.query('SELECT value FROM options WHERE option = "version"', (err, result) => {
			if (err || result === undefined || getVersion() !== result[0].value) {
				return this.migrate(result).catch(e => fatal(e));
			}
			return true;
		}))
		.catch(err => fatal(err));
	}

	async migrate(oldVersion) {
		if (!oldVersion) {
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
					year		YEAR NOT NULL,
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
				await this.query(tables[i], []);
			}

			await this.query(`
				INSERT INTO options (option, value)
				VALUES ('version', '${getVersion()}')
			`);


			return true;
		}
		// for now
		return this.query(`DROP DATABASE ${DATABASE}`, [])
			.then(() => this.checkAndMigrate());
	}
}
