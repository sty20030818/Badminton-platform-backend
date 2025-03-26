# Badminton-platform-backend

在线约球平台的后端服务

## 项目简介

这是一个基于 Node.js + Express + MySQL 开发的羽毛球约球平台后端服务。该平台旨在为羽毛球爱好者提供一个便捷的约球、组队和场地预约的平台。

## 技术栈

- Node.js
- Express.js
- MySQL (Sequelize ORM)
- JWT 认证
- CORS
- Prettier (代码格式化)

## 项目结构

```
.
├── bin/            # 应用启动脚本
├── config/         # 配置文件
├── middlewares/    # 中间件
├── models/         # 数据模型
├── routes/         # 路由处理
├── utils/          # 工具函数
├── migrations/     # 数据库迁移文件
├── seeders/        # 数据库种子文件
└── others/         # 其他资源文件
```

## 开发进度

### 已完成功能
- [x] 项目基础架构搭建
- [x] 数据库设计与迁移
- [x] 用户认证系统
- [x] 代码格式化配置

### 开发中功能
- [ ] 用户管理模块
- [ ] 场地管理模块
- [ ] 约球系统
- [ ] 组队系统

### 待开发功能
- [ ] 消息通知系统
- [ ] 评价系统
- [ ] 数据统计与分析
- [ ] 支付系统集成

## 本地开发

### 环境要求
- Node.js >= 14
- MySQL >= 8.0
- pnpm (推荐包管理器)

### 安装依赖
```bash
pnpm install
```

### 开发模式运行
```bash
pnpm dev
```

### 生产模式运行
```bash
pnpm start
```

### 代码格式化
```bash
pnpm format        # 格式化代码
pnpm format:check  # 检查代码格式
```

## 环境变量配置

项目使用 `.env` 文件进行环境变量配置，请确保在项目根目录下创建 `.env` 文件并配置以下变量：

```
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=badminton_platform
JWT_SECRET=your_jwt_secret
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

[MIT License](LICENSE)
