package infrastructure

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/go-redis/redis/v8"
)

var (
	RedisClient   *redis.Client
	onceInitRedis sync.Once
)

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Redis 地址
		Password: "",               // Redis 密码（如果无密码，留空）
		DB:       0,                // 使用默认数据库
	})
	// 测试连接
	_, err := RedisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalf("Redis 连接失败: %v", err)
	}
	fmt.Println("Redis 连接成功")
}
