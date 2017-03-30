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

// API mount
app.use('/api/v1', api.router);
// API fallback
app.use('/api', (req, res) => res.end('API'));

// Assets
app.use('/', express.static(path.join(__dirname, '..', 'app')));
// Pages
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'app', 'index.html')));

app.listen(process.env.PORT || 8080);
