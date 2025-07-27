package handlers

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LogoffRequest struct {
	Password string `json:"password" binding:"required"`
}

type ChangeUserPasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

type AdminResetPasswordRequest struct {
	Username    string `json:"username" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}
