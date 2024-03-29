import cors from 'cors';
import config from '../config/index';
// const config = require('../config/index');
// const cors = require('cors')('use strict');

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// router for modules
const usersRouter = require('../src/modules/router/users');
const gameRouter = require('../src/modules/router/game');
const predictionRouter = require('../src/modules/router/prediction');
const teamsRouter = require('../src/modules/router/teams');
const statsRouter = require('../src/modules/router/stats');

// database connections
require('../src/models/mongoDB/index');

const app = express();
const { port } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/', express.static('./public/'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// use cors to allow cross origin resource sharing
app.use(cors({ origin: '*', credentials: false }));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
	);
	res.setHeader('Cache-Control', 'no-cache');
	next();
});

const admin = require('firebase-admin')
var serviceAccount = require("../serviceAccountKey.js");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});



var checkAuth = async (req, res, next) => {
	try {
		let authHeader = req.headers.authorization
		let authToken = authHeader.substring(7, authHeader.length)
		let decodedToken = await admin.auth().verifyIdToken(authToken)
		const uid = decodedToken.uid;
		let userRecord = await admin.auth().getUser(uid)
		req.body.userUID = uid
		req.body.email = userRecord.email
		req.body.username = userRecord.displayName
		next()
	} catch (err) {
		res.status(403).send('Unauthorized')
	}
}

// base routes for modules
app.use('/stats', statsRouter);
app.use('/', checkAuth)
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/prediction', predictionRouter);
app.use('/teams', teamsRouter);

// Send email cron job
require('../src/utils/sendMail');
require('../src/utils/updateStrategies');

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));

});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(config.port, () => console.log(`Game server listening on ${port}`));
module.exports = app;
