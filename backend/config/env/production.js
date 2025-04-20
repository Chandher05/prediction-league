`use strict`

module.exports = {
	session: process.env.SESSION,
	token: process.env.TOKEN ,
	cricapi: {
		key: process.env.CRICAPI_KEY,
		series_id: process.env.SERIES_ID
	},
	database: {
		mongoDbUrl: process.env.MONGODB_URL,
		name: process.env.DATABASE,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: process.env.DB_DBPORT,
		dialect: process.env.DB_DIALECT
	},
	PREDICTION_PASSWORD: process.env.PREDICTION_PASSWORD,
}
