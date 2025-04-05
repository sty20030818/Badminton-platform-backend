import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') })

// 导出环境变量配置
const env = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	SECRET: process.env.SECRET,

	// 数据库配置
	DB: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
	},

	// 阿里云OSS配置
	ALIYUN: {
		region: process.env.ALIYUN_REGION,
		accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
		accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
		bucket: process.env.ALIYUN_BUCKET,
	},
}

// 导出环境变量到全局
Object.assign(process.env, env)

export { env }
