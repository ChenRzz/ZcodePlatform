package base_Interface

type Userinfo struct {
	UserIDInfo   uint
	UsernameInfo string
}

type IToken[T any] interface {
	GenerateToken(rawInfo Userinfo) (token T, err error)
	CheckToken(token T) bool
	ExpireToken(token T) error
}
