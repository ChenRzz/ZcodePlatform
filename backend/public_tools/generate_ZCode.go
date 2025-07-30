package public_tools

import (
	"MScProject/core_app/infrastructure"
	"context"
	"fmt"
	"strconv"
	"time"
)

var ctx = context.Background()

func Generate11DigitZCodeID() (uint64, error) {

	datePart := time.Now().Format("060102") // "250730"

	key := "zcode_id_counter:" + datePart

	counter, err := infrastructure.RedisClient.Incr(ctx, key).Result()
	if err != nil {
		return 0, fmt.Errorf("failed to incr redis key: %w", err)
	}

	if counter == 1 {
		infrastructure.RedisClient.Expire(ctx, key, 24*time.Hour)
	}

	serial := fmt.Sprintf("%05d", counter) // 00001 ~ 99999

	fullID := datePart + serial

	id, err := strconv.ParseUint(fullID, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse uint64: %w", err)
	}

	return id, nil
}
