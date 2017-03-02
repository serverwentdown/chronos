import path from 'path';
import express from 'express';
import Database from './database';
import API from './api';

const app = express();
const database = new Database({
	host: 'localhost',
	user: 'root',
	password: '',
});
const api = new API(database);

app.use('/', express.static(path.join(__dirname, '..', 'app')));
app.use('/api/v1', api.router);

app.listen(8080);
