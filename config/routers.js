import express from 'express'

//* 路由中间件
import adminAuth from '../middlewares/admin-auth.js'
import userAuth from '../middlewares/user-auth.js'

//* 前台路由文件
import indexRouter from '../routes/index.js'
import authRouter from '../routes/user/auth.js'
import userRouter from '../routes/user/user.js'
import eventsRouter from '../routes/user/events.js'

//* 后台路由文件
import adminAuthRouter from '../routes/admin/auth.js'
import adminEventsRouter from '../routes/admin/events.js'
import adminVenuesRouter from '../routes/admin/venues.js'
import adminUsersRouter from '../routes/admin/users.js'
import adminGroupsRouter from '../routes/admin/groups.js'
// const adminPointsRouter = require('../routes/admin/points')
// const adminRatingsRouter = require('../routes/admin/ratings')

const router = express.Router()

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

export default router
