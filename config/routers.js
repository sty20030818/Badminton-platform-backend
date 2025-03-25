const express = require('express')
const router = express.Router()

//* 路由中间件
const adminAuth = require('../middlewares/admin-auth')
const userAuth = require('../middlewares/user-auth')

//* 前台路由文件
const indexRouter = require('../routes/index')
const authRouter = require('../routes/user/auth')
const userRouter = require('../routes/user/user')
const eventsRouter = require('../routes/user/events')

//* 后台路由文件
const adminAuthRouter = require('../routes/admin/auth')
const adminEventsRouter = require('../routes/admin/events')
const adminVenuesRouter = require('../routes/admin/venues')
const adminUsersRouter = require('../routes/admin/users')
const adminGroupsRouter = require('../routes/admin/groups')
// const adminPointsRouter = require('../routes/admin/points')
// const adminRatingsRouter = require('../routes/admin/ratings')

//* 前台路由配置
router.use('/', indexRouter)
router.use('/auth', authRouter)
router.use('/user', userAuth, userRouter)
router.use('/events', userAuth, eventsRouter)

//* 后台路由配置
router.use('/admin/auth', adminAuthRouter)
router.use('/admin/users', adminAuth, adminUsersRouter)
router.use('/admin/events', adminAuth, adminEventsRouter)
router.use('/admin/venues', adminAuth, adminVenuesRouter)
router.use('/admin/groups', adminAuth, adminGroupsRouter)
// router.use('/admin/points', adminAuth, adminPointsRouter)
// router.use('/admin/ratings', adminAuth, adminRatingsRouter)

module.exports = router
