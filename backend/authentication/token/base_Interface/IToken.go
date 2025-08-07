package base_Interface

type Userinfo struct {
	UserIDInfo    uint
	UserZcodeInfo uint64
	UsernameInfo  string
}

type IToken[T any] interface {
	GenerateToken(rawInfo *Userinfo) (token T, err error)
	CheckParseToken(token T) (*Userinfo, error)
	ExpireToken(token T) error
}
