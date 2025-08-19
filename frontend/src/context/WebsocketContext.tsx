import React, { createContext, useContext, useEffect, useState, useRef } from 'react'

interface WebSocketMessage {
    type: string
    data: any
    sender: string
    target?: string
    timestamp: number
}

interface YjsUpdateData {
    document_key: string
    update: number[]
    state_vector?: number[]
    requester?: string
}

interface ChatData {
    message: string
}

interface WebSocketContextType {
    websocket: WebSocket | null
    isConnected: boolean
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'


    subscribe: (eventType: string, callback: (data: any) => void) => () => void

    sendYjsUpdate: (documentKey: string, update: Uint8Array) => void
    sendYjsSyncRequest: (documentKey: string) => void
    sendYjsSyncResponse: (documentKey: string, stateVector: Uint8Array, requester: string) => void
    sendChatMessage: (message: string) => void
    sendTeacherExecution: (executionResult: any) => void
    sendStudentExecution: (executionResult: any, target?: string) => void
}

interface WebSocketProviderProps {
    lectureId: number
    userZCode: string
    userRole: 'teacher' | 'student'
    userName: string
    children: React.ReactNode
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                        lectureId,
                                                                        userZCode,
                                                                        userRole,
                                                                        userName,
                                                                        children
                                                                    }) => {
    const [websocket, setWebsocket] = useState<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')


    const eventListeners = useRef<Map<string, Set<(data: any) => void>>>(new Map())

    useEffect(() => {
        const wsUrl = `ws://51.107.216.21:8081/ws/classroom/${lectureId}?zcode=${userZCode}&role=${userRole}&name=${encodeURIComponent(userName)}`

        console.log(`[WebSocket] Connecting to: ${wsUrl}`)
        setConnectionStatus('connecting')

        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            console.log('[WebSocket] Connected successfully')
            setIsConnected(true)
            setConnectionStatus('connected')
        }

        ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data)
                console.log(`[WebSocket] Received message:`, message)
                handleMessage(message)
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error)
            }
        }

        ws.onclose = (event) => {
            console.log(`[WebSocket] Connection closed:`, event.code, event.reason)
            setIsConnected(false)
            setConnectionStatus('disconnected')
        }

        ws.onerror = (error) => {
            console.error('[WebSocket] Error:', error)
            setConnectionStatus('error')
        }

        setWebsocket(ws)

        return () => {
            console.log('[WebSocket] Cleaning up connection')
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close()
            }
        }
    }, [lectureId, userZCode, userRole, userName])

    const handleMessage = (message: WebSocketMessage) => {
        const listeners = eventListeners.current.get(message.type)
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(message)
                } catch (error) {
                    console.error(`[WebSocket] Error in event listener for ${message.type}:`, error)
                }
            })
        }
    }

    const subscribe = (eventType: string, callback: (data: any) => void): (() => void) => {
        if (!eventListeners.current.has(eventType)) {
            eventListeners.current.set(eventType, new Set())
        }

        const listeners = eventListeners.current.get(eventType)!
        listeners.add(callback)

        console.log(`[WebSocket] Subscribed to ${eventType}, total listeners: ${listeners.size}`)

        return () => {
            listeners.delete(callback)
            console.log(`[WebSocket] Unsubscribed from ${eventType}, remaining listeners: ${listeners.size}`)
            if (listeners.size === 0) {
                eventListeners.current.delete(eventType)
            }
        }
    }

    const sendMessage = (type: string, data: any, target?: string) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            const message: WebSocketMessage = {
                type,
                data,
                sender: userZCode,
                target,
                timestamp: Date.now()
            }
            websocket.send(JSON.stringify(message))
            console.log(`[WebSocket] Sent message:`, message)
        } else {
            console.warn(`[WebSocket] Cannot send message, connection not ready. State: ${websocket?.readyState}`)
        }
    }

    const sendYjsUpdate = (documentKey: string, update: Uint8Array) => {
        const data: YjsUpdateData = {
            document_key: documentKey,
            update: Array.from(update)
        }
        sendMessage('yjs_update', data)
    }

    const sendYjsSyncRequest = (documentKey: string) => {
        const data: YjsUpdateData = {
            document_key: documentKey,
            update: []
        }
        sendMessage('yjs_sync_request', data)
    }

    const sendYjsSyncResponse = (documentKey: string, stateVector: Uint8Array, requester: string) => {
        const data: YjsUpdateData = {
            document_key: documentKey,
            update: Array.from(stateVector),
            requester
        }
        sendMessage('yjs_sync_response', data)
    }

    const sendChatMessage = (message: string) => {
        const data: ChatData = {
            message
        }
        sendMessage('chat_message', data)
    }
    const sendTeacherExecution = (executionResult: any) => {
        sendMessage('teacher_execution', executionResult)
    }


    const sendStudentExecution = (executionResult: any, target?: string) => {
        sendMessage('student_execution', executionResult, target)
    }

    const contextValue: WebSocketContextType = {
        websocket,
        isConnected,
        connectionStatus,
        subscribe,
        sendYjsUpdate,
        sendYjsSyncRequest,
        sendYjsSyncResponse,
        sendChatMessage,
        sendTeacherExecution,
        sendStudentExecution,
    }

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocketContext = (): WebSocketContextType => {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider')
    }
    return context
}