import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import routers from './config/routers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

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
		'Origin',
	],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	maxAge: 86400, // 预检请求的结果缓存24小时
}
app.use(cors(corsOptions))

//* 路由配置
app.use('/', routers)

export default app
