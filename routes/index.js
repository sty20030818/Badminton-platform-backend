import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
	res.json({ message: '在线约球系统后台' })
})

export default router
