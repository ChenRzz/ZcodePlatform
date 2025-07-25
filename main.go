package main

import (
	"MScProject/infrastructure"
)

func main() {
	infrastructure.InitSchema(infrastructure.GetDB())
}
