package infrastructure

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"sync"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db         *gorm.DB
	onceInitDB sync.Once
)

func InitDB() {
	dsn := "root:msc432@tcp(mysql:3306)/MscProject?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect Databases：%v", err)
	}
	fmt.Println("Databases connect successful")
}

func GetDB() *gorm.DB {
	onceInitDB.Do(InitDB)
	return db.Session(&gorm.Session{Context: &gin.Context{}})
}
func SetupDatabase() {
	GetDB()
}
