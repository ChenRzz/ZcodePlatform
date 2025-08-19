FROM golang:1.21-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制go.mod和go.sum文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 编译应用
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 使用轻量级镜像作为运行环境
FROM alpine:latest

# 安装ca-certificates（用于HTTPS请求）
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建阶段复制编译好的二进制文件
COPY --from=builder /app/main .

# 暴露端口
EXPOSE 8081

# 运行应用
CMD ["./main"]