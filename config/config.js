import dotenv from 'dotenv'
dotenv.config()

const config = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		dialect: 'mysql',
		timezone: '+08:00',
	},
	// development: {
	// 	username: 'root',
	// 	password: 'rootroot',
	// 	database: 'badminton_platform',
	// 	host: '127.0.0.1',
	// 	dialect: 'mysql',
	// 	timezone: '+08:00',
	// },
	test: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
		dialect: 'mysql',
		timezone: '+08:00',
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		dialect: 'mysql',
		timezone: '+08:00',
	},
}

export default config
