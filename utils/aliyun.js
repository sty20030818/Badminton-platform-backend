import multer from 'multer'
import MAO from 'multer-aliyun-oss'
import OSS from 'ali-oss'
import pkg from 'http-errors'
const { BadRequest } = pkg

//* 调试信息
// console.log('当前工作目录:', process.cwd())
// console.log('环境变量:', {
// 	NODE_ENV: process.env.NODE_ENV,
// 	ALIYUN_ACCESS_KEY_ID: process.env.ALIYUN_ACCESS_KEY_ID,
// 	ALIYUN_ACCESS_KEY_SECRET: process.env.ALIYUN_ACCESS_KEY_SECRET?.slice(0, 4) + '****',
// 	ALIYUN_REGION: process.env.ALIYUN_REGION,
// 	ALIYUN_BUCKET: process.env.ALIYUN_BUCKET,
// })

//* 阿里云配置信息
const config = {
	region: process.env.ALIYUN_REGION,
	accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
	accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
	bucket: process.env.ALIYUN_BUCKET,
}

//* 验证配置
if (!config.accessKeyId || !config.accessKeySecret) {
	console.error('阿里云OSS配置错误:', {
		accessKeyId: config.accessKeyId ? '已设置' : '未设置',
		accessKeySecret: config.accessKeySecret ? '已设置' : '未设置',
		region: config.region,
		bucket: config.bucket,
	})
	throw new Error('阿里云OSS配置不完整,请检查环境变量。确保.env文件存在且包含必要的配置。')
}

const client = new OSS(config)

//* multer 配置信息
const upload = multer({
	storage: MAO({
		config: config,
		destination: 'uploads', //* 自定义上传目录
	}),
	limits: {
		fileSize: 5 * 1024 * 1024, //* 限制上传文件的大小为：5MB
	},
	fileFilter: function (req, file, cb) {
		//* 只允许上传图片
		const fileType = file.mimetype.split('/')[0]
		const isImage = fileType === 'image'

		if (!isImage) {
			return cb(new BadRequest('只允许上传图片'))
		}

		cb(null, true)
	},
})

//*  单文件上传，指定表单字段名为 file
const singleFileUpload = upload.single('file')

export { config, client, singleFileUpload }
