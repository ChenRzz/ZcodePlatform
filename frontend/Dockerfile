# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目（包含TypeScript编译 + Vite构建）
RUN npm run build

# 运行阶段 - 使用Nginx提供静态文件
FROM nginx:alpine

# 从构建阶段复制dist文件夹到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]