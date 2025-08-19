export interface User {
    zcode: string
    role: 'teacher' | 'student'
    name: string
}

export interface OnlineUser {
    zcode: string
    name: string
    role: 'teacher' | 'student'
    joined_at: number
}

export interface ClassroomState {
    lecture_id: number
    teacher_zcode: string
    online_users: OnlineUser[]
    chat_messages: ChatMessage[]
    online_count: number
    created_at: string
}

export interface ChatMessage {
    id: string
    sender_id: string
    content: string
    created_at: number
}

export interface JoinClassroomResponse {
    lecture_id: number
    lecture_name:string
    user_zcode: string
    user_name: string
    user_role: 'teacher' | 'student'
    websocket_url: string
    message: string
}
