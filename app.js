const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const adminAuth = require('./middlewares/admin-auth')
const cors = require('cors')

require('dotenv').config()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

// 后台路由文件
const adminEventsRouter = require('./routes/admin/events')
const adminVenuesRouter = require('./routes/admin/venues')
const adminUsersRouter = require('./routes/admin/users')
const adminGroupsRouter = require('./routes/admin/groups')
// const adminPointsRouter = require('./routes/admin/points')
// const adminRatingsRouter = require('./routes/admin/ratings')
const adminAuthRouter = require('./routes/admin/auth')
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//* 禁用缓存的中间件
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store')
	next()
})

//* CORS 跨域配置
const corsOptions = {
	origin: 'http://localhost:5173', // 指定前端域名
	credentials: true, // 允许携带凭证
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
	allowedHeaders: [
		'Content-Type',
		'Token',
		'Authorization',
		'X-Requested-With',
		'Accept',
		'Origin'
	],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	maxAge: 86400 // 预检请求的结果缓存24小时
}
app.use(cors(corsOptions))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// 后台路由配置
app.use('/admin/events', adminAuth, adminEventsRouter)
app.use('/admin/venues', adminAuth, adminVenuesRouter)
app.use('/admin/users', adminAuth, adminUsersRouter)
app.use('/admin/groups', adminAuth, adminGroupsRouter)
// app.use('/admin/points', adminAuth, adminPointsRouter)
// app.use('/admin/ratings', adminAuth, adminRatingsRouter)
app.use('/admin/auth', adminAuthRouter)
module.exports = app
