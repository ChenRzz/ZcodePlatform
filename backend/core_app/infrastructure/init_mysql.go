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
	dsn := "root:msc432@tcp(127.0.0.1:3306)/MscProject?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect Databases：%v", err)
	}
	fmt.Println("Databases connect successful")
}

func InitSchema(db *gorm.DB) {
	if db.Migrator().HasTable("users") && db.Migrator().HasTable("roles") &&
		db.Migrator().HasTable("auth_point") && db.Migrator().HasTable("user_role") &&
		db.Migrator().HasTable("role_auth_point") && db.Migrator().HasTable("classes") &&
		db.Migrator().HasTable("lectures") && db.Migrator().HasTable("class_participants") {
		fmt.Println("database init successful，skip executing schema")
		return
	}
	content, err := os.ReadFile("sql/schema.sql")
	if err != nil {
		log.Fatalf("Failed to load schema.sql: %v", err)
	}
	statements := strings.Split(string(content), ";")
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		if err := db.Exec(stmt).Error; err != nil {
			log.Fatalf("Failed to execute SQL: %v\nSQL: %s", err, stmt)
		}
	}
	fmt.Println("Databases init success")
}

func GetDB() *gorm.DB {
	onceInitDB.Do(InitDB)
	return db.Session(&gorm.Session{Context: &gin.Context{}})
}
func SetupDatabase() {
	GetDB()
	InitSchema(db)
}
