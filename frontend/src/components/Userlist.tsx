import React, { useState, useEffect } from 'react'
import { Users, Crown, GraduationCap, Circle, Clock } from 'lucide-react'
import type { OnlineUser } from '../types/classroom'
import { useWebSocketContext } from '../context/WebsocketContext.tsx'

interface UserListProps {
    initialUsers?: OnlineUser[]
    selectedStudentZCode?: string | null
    onStudentSelect?: (studentZCode: string) => void
    className?: string
    currentUserZCode: string
    currentUserRole: 'teacher' | 'student'
}

export const UserList: React.FC<UserListProps> = ({
                                                      initialUsers = [],
                                                      selectedStudentZCode,
                                                      onStudentSelect,
                                                      className = '',
                                                      currentUserZCode,
                                                      currentUserRole
                                                  }) => {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>(initialUsers)

    const {
        isConnected,
        subscribe
    } = useWebSocketContext()

    useEffect(() => {
        const unsubscribe = subscribe('user_join', (message) => {
            console.log('[UserList] User joined:', message)
            const data = message.data
            setOnlineUsers(prev => {
                const exists = prev.some(user => user.zcode === data.user_zcode)
                if (exists) {
                    return prev.map(user =>
                        user.zcode === data.user_zcode
                            ? { ...user, name: data.user_name, role: data.user_role as 'teacher' | 'student' }
                            : user
                    )
                }

                const newUser: OnlineUser = {
                    zcode: data.user_zcode,
                    name: data.user_name,
                    role: data.user_role as 'teacher' | 'student',
                    joined_at: Date.now() / 1000
                }
                return [...prev, newUser]
            })
        })

        return unsubscribe
    }, [subscribe])

    useEffect(() => {
        const unsubscribe = subscribe('user_leave', (message) => {
            console.log('[UserList] User left:', message)
            const data = message.data
            setOnlineUsers(prev => prev.filter(user => user.zcode !== data.user_zcode))
        })

        return unsubscribe
    }, [subscribe])
    useEffect(() => {
        if (initialUsers.length > 0) {
            setOnlineUsers(initialUsers)
        }
    }, [initialUsers])
    const teachers = onlineUsers.filter(user => user.role === 'teacher')
    const students = onlineUsers.filter(user => user.role === 'student')

    const handleUserClick = (user: OnlineUser) => {
        if (currentUserRole === 'teacher' && user.role === 'student' && onStudentSelect) {
            onStudentSelect(user.zcode)
        }
    }

    const formatJoinTime = (timestamp: number) => {
        const now = Date.now() / 1000
        const diff = now - timestamp

        if (diff < 60) return 'Just now'
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return new Date(timestamp * 1000).toLocaleDateString()
    }

    const getUserStatusColor = (user: OnlineUser) => {
        if (user.role === 'teacher') return 'success'
        return 'primary'
    }

    const isUserSelected = (user: OnlineUser) => {
        return user.role === 'student' && selectedStudentZCode === user.zcode
    }

    const isClickable = (user: OnlineUser) => {
        return currentUserRole === 'teacher' && user.role === 'student'
    }

    return (
        <div className={`card shadow-sm h-100 ${className}`}>
            <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                        <Users size={20} className="me-2" />
                        Online Users ({onlineUsers.length})
                    </h5>
                    <div className="d-flex align-items-center">
                        <Circle
                            size={8}
                            className={`me-1 ${isConnected ? 'text-success' : 'text-danger'}`}
                            fill="currentColor"
                        />
                        <small className={isConnected ? 'text-success' : 'text-danger'}>
                            {isConnected ? 'Live' : 'Offline'}
                        </small>
                    </div>
                </div>
            </div>

            {/* 固定高度的用户列表区域 */}
            <div className="card-body p-0" style={{ height: '220px', overflowY: 'auto' }}>
                {onlineUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                        <Users size={32} className="mb-2 opacity-50" />
                        <p className="small mb-0">No users online</p>
                        <p className="small text-muted">Waiting for participants...</p>
                    </div>
                ) : (
                    <div>
                        {/* Teachers Section */}
                        {teachers.length > 0 && (
                            <div>
                                <div className="px-3 py-2 bg-light border-bottom">
                                    <small className="text-muted fw-medium d-flex align-items-center">
                                        <Crown size={14} className="me-1" />
                                        Teachers ({teachers.length})
                                    </small>
                                </div>
                                {teachers.map(teacher => (
                                    <div
                                        key={teacher.zcode}
                                        className={`list-group-item border-0 py-3 ${
                                            teacher.zcode === currentUserZCode ? 'bg-success bg-opacity-10' : ''
                                        }`}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className={`bg-${getUserStatusColor(teacher)} rounded-circle me-3`}
                                                 style={{ width: '10px', height: '10px' }}>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center">
                                                    <Crown size={16} className="text-warning me-2" />
                                                    <div className="fw-medium text-dark">
                                                        {teacher.name}
                                                        {teacher.zcode === currentUserZCode && (
                                                            <span className="text-muted"> (You)</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="small text-muted d-flex align-items-center mt-1">
                                                    <Clock size={12} className="me-1" />
                                                    {formatJoinTime(teacher.joined_at)} • {teacher.zcode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Students Section */}
                        {students.length > 0 && (
                            <div>
                                <div className="px-3 py-2 bg-light border-bottom">
                                    <small className="text-muted fw-medium d-flex align-items-center">
                                        <GraduationCap size={14} className="me-1" />
                                        Students ({students.length})
                                        {currentUserRole === 'teacher' && (
                                            <span className="ms-2 text-info">(Click to view code)</span>
                                        )}
                                    </small>
                                </div>
                                {students.map(student => (
                                    <button
                                        key={student.zcode}
                                        className={`list-group-item list-group-item-action border-0 py-3 w-100 text-start ${
                                            isUserSelected(student) ? 'active' : ''
                                        } ${
                                            student.zcode === currentUserZCode ? 'bg-primary bg-opacity-10' : ''
                                        } ${
                                            isClickable(student) ? '' : 'pe-none'
                                        }`}
                                        onClick={() => handleUserClick(student)}
                                        disabled={!isClickable(student)}
                                        style={{
                                            cursor: isClickable(student) ? 'pointer' : 'default',
                                            border: 'none'
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className={`bg-${getUserStatusColor(student)} rounded-circle me-3`}
                                                 style={{ width: '10px', height: '10px' }}>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center">
                                                    <GraduationCap size={16} className="text-primary me-2" />
                                                    <div className="fw-medium">
                                                        {student.name}
                                                        {student.zcode === currentUserZCode && (
                                                            <span className="text-muted"> (You)</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="small text-muted d-flex align-items-center mt-1">
                                                    <Clock size={12} className="me-1" />
                                                    {formatJoinTime(student.joined_at)} • {student.zcode}
                                                </div>
                                            </div>
                                            {isUserSelected(student) && (
                                                <div className="text-primary">
                                                    <Circle size={8} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer with summary */}
            <div className="card-footer bg-light py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        {teachers.length} teacher{teachers.length !== 1 ? 's' : ''}, {students.length} student{students.length !== 1 ? 's' : ''}
                    </small>
                    {!isConnected && (
                        <small className="text-danger">
                            Connection lost
                        </small>
                    )}
                </div>
            </div>
        </div>
    )
}