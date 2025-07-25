package infrastructure

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"strings"
	"sync"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db         *gorm.DB
	onceInitDB sync.Once
)

func InitDB() {
	dsn := "msc_user:msc123@tcp(127.0.0.1:3306)/MscProject?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("数据库连接失败：%v", err)
	}
	fmt.Println("数据库连接成功！")
}

func InitSchema(db *gorm.DB) {
	content, err := os.ReadFile("sql/schema.sql")
	if err != nil {
		log.Fatalf("❌ 读取 schema.sql 失败: %v", err)
	}
	statements := strings.Split(string(content), ";")
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		if err := db.Exec(stmt).Error; err != nil {
			log.Fatalf("❌ 执行 SQL 失败: %v\nSQL: %s", err, stmt)
		}
	}
	fmt.Println("✅ 数据表结构初始化完成")
}

func GetDB() *gorm.DB {
	onceInitDB.Do(InitDB)
	return db.Session(&gorm.Session{Context: &gin.Context{}})
}
