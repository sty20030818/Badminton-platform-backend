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

//*CORS 跨域配置
const corsOptions = {
	// origin: 'http://localhost:3000',
	// credentials: true,
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
