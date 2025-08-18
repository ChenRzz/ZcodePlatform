package infrastructure

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"log"
)

var (
	RedisClient *redis.Client
)

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	_, err := RedisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalf("Redis connect error: %v", err)
	}
	fmt.Println("Redis connect successfully")
}
