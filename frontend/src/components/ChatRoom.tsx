import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import type { ChatMessage } from '../types/classroom'
import { useWebSocketContext } from '../context/WebsocketContext.tsx'

interface ChatRoomProps {
    currentUserZCode: string
    currentUserName: string
    onlineUsers?: Array<{zcode: string, name: string, role: string}>
    initialMessages?: ChatMessage[]
    disabled?: boolean
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
                                                      currentUserZCode,
                                                      currentUserName,
                                                      onlineUsers = [],
                                                      initialMessages = [],
                                                      disabled = false
                                                  }) => {
    const [inputMessage, setInputMessage] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [userNames, setUserNames] = useState<Map<string, string>>(new Map())
    const messagesEndRef = useRef<HTMLDivElement>(null)


    const {
        isConnected,
        subscribe,
        sendChatMessage
    } = useWebSocketContext()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }


    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const unsubscribe = subscribe('chat_message', (message) => {
            console.log('[Chat] Received message:', message)


            let timestamp = message.data.created_at || message.timestamp
            if (typeof timestamp === 'number' && timestamp > 1000000000000) {
                timestamp = timestamp / 1000
            }

            const chatMessage: ChatMessage = {
                id: message.data.id || `server_${Date.now()}_${Math.random()}`,
                sender_id: message.data.sender_id || message.sender,
                content: message.data.content || message.data.message,
                created_at: timestamp
            }

            setMessages(prev => {
                if (chatMessage.sender_id === currentUserZCode) {
                    console.log('[Chat] Replacing optimistic message with server message')
                    const filtered = prev.filter(msg => {
                        const isOptimistic = msg.id.startsWith('optimistic_') &&
                            msg.sender_id === currentUserZCode &&
                            msg.content.trim() === chatMessage.content.trim()
                        return !isOptimistic
                    })

                    const exists = filtered.some(msg => msg.id === chatMessage.id)
                    if (exists) return filtered

                    return [...filtered, chatMessage]
                }

                const exists = prev.some(msg => msg.id === chatMessage.id)
                if (exists) return prev

                return [...prev, chatMessage]
            })
        })

        return unsubscribe
    }, [subscribe, currentUserZCode])

    useEffect(() => {
        const nameMap = new Map<string, string>()
        nameMap.set(currentUserZCode, currentUserName)

        onlineUsers.forEach(user => {
            nameMap.set(user.zcode, user.name)
        })

        setUserNames(nameMap)
    }, [currentUserZCode, currentUserName, onlineUsers])


    useEffect(() => {
        const unsubscribe = subscribe('user_join', (message) => {
            console.log('[Chat] User joined:', message)

            setUserNames(prev => new Map(prev.set(message.data.user_zcode, message.data.user_name)))

            const systemMessage: ChatMessage = {
                id: `system_join_${Date.now()}_${Math.random()}`,
                sender_id: 'system',
                content: `${message.data.user_name} joined the classroom`,
                created_at: Date.now() / 1000
            }
            setMessages(prev => [...prev, systemMessage])
        })

        return unsubscribe
    }, [subscribe])


    useEffect(() => {
        const unsubscribe = subscribe('user_leave', (message) => {
            console.log('[Chat] User left:', message)
            const systemMessage: ChatMessage = {
                id: `system_leave_${Date.now()}_${Math.random()}`,
                sender_id: 'system',
                content: `${message.data.user_name} left the classroom`,
                created_at: Date.now() / 1000
            }
            setMessages(prev => [...prev, systemMessage])
        })

        return unsubscribe
    }, [subscribe])


    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(prev => {

                const newMessages = [...prev]
                initialMessages.forEach(newMsg => {
                    const exists = newMessages.some(msg => msg.id === newMsg.id)
                    if (!exists) {
                        newMessages.push(newMsg)
                    }
                })
                return newMessages.sort((a, b) => a.created_at - b.created_at)
            })
        }
    }, [initialMessages])

    const handleSend = () => {
        const message = inputMessage.trim()
        if (!message || disabled || !isConnected) return

        console.log('[Chat] Sending message:', message)


        const optimisticId = `optimistic_${Date.now()}_${Math.random()}`
        const optimisticMessage: ChatMessage = {
            id: optimisticId,
            sender_id: currentUserZCode,
            content: message,
            created_at: Date.now() / 1000
        }
        setMessages(prev => [...prev, optimisticMessage])

        sendChatMessage(message)


        setTimeout(() => {
            setMessages(prev => {
                const hasOptimistic = prev.some(msg => msg.id === optimisticId)
                if (hasOptimistic) {
                    console.log('[Chat] Message send timeout, marking as failed')
                    return prev.map(msg =>
                        msg.id === optimisticId
                            ? { ...msg, id: msg.id.replace('optimistic_', 'failed_') }
                            : msg
                    )
                }
                return prev
            })
        }, 5000)


        setInputMessage('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatTime = (timestamp: number) => {
        let date: Date

        if (!timestamp || isNaN(timestamp)) {
            date = new Date()
        } else if (timestamp < 1000000000) {
            date = new Date(timestamp * 1000)
        } else if (timestamp < 10000000000) {
            date = new Date(timestamp * 1000)
        } else {
            date = new Date(timestamp)
        }

        if (isNaN(date.getTime())) {
            return new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getMessageStyle = (message: ChatMessage) => {
        if (message.sender_id === 'system') {
            return 'bg-gray-100 text-gray-600 text-sm'
        }
        if (message.sender_id === currentUserZCode) {
            return 'bg-primary text-white'
        }
        return 'bg-light text-dark'
    }

    const getMessageAlignment = (message: ChatMessage) => {
        if (message.sender_id === 'system') {
            return 'text-center'
        }
        if (message.sender_id === currentUserZCode) {
            return 'text-end'
        }
        return 'text-start'
    }

    const shouldShowSenderName = (message: ChatMessage) => {
        return message.sender_id !== 'system' && message.sender_id !== currentUserZCode
    }

    const getSenderDisplayName = (message: ChatMessage) => {
        if (message.sender_id === 'system') return 'System'
        if (message.sender_id === currentUserZCode) return 'You'


        return userNames.get(message.sender_id) || message.sender_id
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                        <MessageCircle size={20} className="me-2" />
                        Chat Room
                    </h5>
                    <div className="d-flex align-items-center">
                        <div className={`badge ${isConnected ? 'bg-success' : 'bg-danger'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body d-flex flex-column p-0">
                {/* Messages Area */}
                <div
                    className="flex-grow-1 p-3 overflow-auto"
                    style={{ maxHeight: '300px', minHeight: '200px' }}
                >
                    {messages.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <MessageCircle size={32} className="mb-2 opacity-50" />
                            <p className="small mb-0">No messages yet</p>
                            <p className="small text-muted">Start the conversation!</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-3 ${getMessageAlignment(message)}`}
                                >
                                    <div
                                        className={`d-inline-block px-3 py-2 rounded ${getMessageStyle(message)}`}
                                        style={{ maxWidth: message.sender_id === 'system' ? '100%' : '80%' }}
                                    >
                                        {shouldShowSenderName(message) && (
                                            <div className="small text-muted mb-1">
                                                {getSenderDisplayName(message)}
                                            </div>
                                        )}
                                        <div className="break-words">{message.content}</div>
                                        <div className="small mt-1 d-flex align-items-center justify-content-between">
                                            <span className="opacity-75">
                                                {formatTime(message.created_at)}
                                            </span>
                                            {message.id.startsWith('optimistic_') && (
                                                <span className="opacity-75 ms-1" title="Sending...">
                                                    <div className="spinner-border spinner-border-sm" style={{ width: '10px', height: '10px' }} />
                                                </span>
                                            )}
                                            {message.id.startsWith('failed_') && (
                                                <span className="text-warning ms-1" title="Failed to send">
                                                    ⚠️
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-top p-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={
                                disabled
                                    ? "Chat disabled"
                                    : !isConnected
                                        ? "Connecting..."
                                        : "Type a message..."
                            }
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={disabled || !isConnected}
                            maxLength={500}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSend}
                            disabled={disabled || !isConnected || !inputMessage.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    {!isConnected && (
                        <small className="text-danger mt-1 d-block">
                            Reconnecting to chat...
                        </small>
                    )}
                </div>
            </div>
        </div>
    )
}