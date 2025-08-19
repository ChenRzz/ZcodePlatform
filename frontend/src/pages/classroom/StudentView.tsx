import React, { useState, useEffect } from 'react'
import { classroomService } from '../../services/classroom_apis'
import type { JoinClassroomResponse, ClassroomState } from '../../types/classroom'
import { useUser } from '../../context/UserContext'
import { useWebSocketContext, WebSocketProvider } from '../../context/WebsocketContext.tsx'
import { CodeEditor } from '../../components/CodeEditor'
import { ChatRoom } from '../../components/ChatRoom'
import { UserList } from '../../components/Userlist.tsx'
import { SimpleTerminal } from '../../components/SimpleTerminal'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface StudentViewProps {
    classroomData: JoinClassroomResponse
}

interface ExecutionResult {
    id: string
    output: string
    error?: string
    duration_ms: number
    executed_at: number
    executor: string
    status: 'running' | 'completed' | 'failed' | 'timeout'
    exit_code?: number
}

const StudentViewContent: React.FC<StudentViewProps> = ({ classroomData }) => {
    const { userZcode } = useUser()

    const lectureId = classroomData.lecture_id
    const studentZcode = classroomData.user_zcode
    const studentName = classroomData.user_name
    const lectureName=classroomData.lecture_name

    const [currentState, setCurrentState] = useState<ClassroomState | null>(null)
    const [teacherExecutionResults, setTeacherExecutionResults] = useState<ExecutionResult[]>([])
    const [myExecutionResults, setMyExecutionResults] = useState<ExecutionResult[]>([])
    const [isLoadingState, setIsLoadingState] = useState(true)
    const [stateError, setStateError] = useState<string | null>(null)
    const [isExecutingMyCode, setIsExecutingMyCode] = useState(false)

    const { sendStudentExecution, subscribe } = useWebSocketContext()

    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                setIsLoadingState(true)
                setStateError(null)
                const state = await classroomService.getClassroomState(lectureId, userZcode!)
                setCurrentState(state)
                console.log('[StudentView] Initial classroom state loaded:', state)
            } catch (error) {
                console.error('[StudentView] Failed to fetch initial classroom state:', error)
                setStateError(error instanceof Error ? error.message : 'Failed to load classroom state')
            } finally {
                setIsLoadingState(false)
            }
        }

        fetchInitialState()
    }, [lectureId, userZcode])

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const newState = await classroomService.getClassroomState(lectureId, userZcode!)
                setCurrentState(prev => {
                    if (!prev || prev.online_count !== newState.online_count ||
                        prev.chat_messages?.length !== newState.chat_messages?.length) {
                        console.log('[StudentView] Classroom state updated via polling')
                        return newState
                    }
                    return prev
                })
            } catch (error) {
                console.error('[StudentView] Failed to refresh classroom state:', error)
            }
        }, 15000)

        return () => clearInterval(interval)
    }, [lectureId, userZcode])


    useEffect(() => {
        const unsubscribe = subscribe('teacher_execution', (message) => {
            console.log('[StudentView] Received teacher execution:', message)
            const executionResult = message.data

            setTeacherExecutionResults(prev => [...prev, executionResult])
        })

        return unsubscribe
    }, [subscribe])

    useEffect(() => {
        const unsubscribe = subscribe('student_execution', (message) => {
            console.log('[StudentView] Received student execution:', message)
            const executionResult = message.data

            if (message.sender === studentZcode || executionResult.executor === studentName) {
                setMyExecutionResults(prev => [...prev, executionResult])
                console.log('[StudentView] Added execution result to my terminal')
            }
        })

        return unsubscribe
    }, [subscribe, studentZcode, studentName])

    const handleExecuteMyCode = async (code: string) => {
        try {
            setIsExecutingMyCode(true)
            console.log('[StudentView] Executing student code:', code.substring(0, 100) + '...')

            const result = await classroomService.executeCode(lectureId, studentZcode, code, 'student')

            const executionResult: ExecutionResult = {
                id: result.id,
                output: result.output,
                error: result.error,
                duration_ms: result.duration_ms,
                executed_at: Date.now() / 1000,
                executor: studentName,
                status: result.status,
                exit_code: result.exit_code
            }
            setMyExecutionResults(prev => [...prev, executionResult])

            sendStudentExecution(executionResult)

        } catch (error) {
            console.error('[StudentView] Code execution failed:', error)

            const errorResult: ExecutionResult = {
                id: `error_${Date.now()}_${Math.random()}`,
                output: '',
                error: error instanceof Error ? error.message : 'Execution failed',
                duration_ms: 0,
                executed_at: Date.now() / 1000,
                executor: studentName,
                status: 'failed',
                exit_code: 1
            }
            setMyExecutionResults(prev => [...prev, errorResult])
        } finally {
            setIsExecutingMyCode(false)
        }
    }

    const handleRefreshState = async () => {
        try {
            setIsLoadingState(true)
            setStateError(null)
            const newState = await classroomService.getClassroomState(lectureId, userZcode!)
            setCurrentState(newState)
        } catch (error) {
            setStateError(error instanceof Error ? error.message : 'Failed to refresh')
        } finally {
            setIsLoadingState(false)
        }
    }

    const clearTeacherResults = () => {
        setTeacherExecutionResults([])
    }

    const clearMyResults = () => {
        setMyExecutionResults([])
    }

    const teacherUser = currentState?.online_users?.find(user => user.role === 'teacher')
    const teacherZcode = currentState?.teacher_zcode || teacherUser?.zcode || 'Teacher'
    const teacherName = teacherUser?.name || teacherZcode

    if (isLoadingState && !currentState) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading classroom...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1 className="h4 mb-2 d-flex align-items-center">
                                        📚 {lectureName} #{lectureId}
                                    </h1>
                                    <p className="text-muted mb-0">
                                        Student: {studentName} ({studentZcode}) | Teacher: {teacherName} |
                                        Online: {currentState?.online_count || 0} users
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-primary fs-6">Student</span>
                                    {stateError && (
                                        <button
                                            onClick={handleRefreshState}
                                            className="btn btn-outline-warning btn-sm d-flex align-items-center"
                                            disabled={isLoadingState}
                                        >
                                            <RefreshCw size={14} className={`me-1 ${isLoadingState ? 'spin' : ''}`} />
                                            Retry
                                        </button>
                                    )}
                                </div>
                            </div>
                            {stateError && (
                                <div className="alert alert-warning mt-3 mb-0 d-flex align-items-center">
                                    <AlertCircle size={16} className="me-2" />
                                    <small>
                                        Failed to load classroom data: {stateError}. Using cached data.
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column - User List & Chat */}
                <div className="col-lg-3">
                    <div className="row g-4">
                        {/* User List */}
                        <div className="col-12">
                            <UserList
                                currentUserZCode={userZcode!}
                                currentUserRole="student"
                                initialUsers={currentState?.online_users || []}
                            />
                        </div>

                        {/* Chat Room */}
                        <div className="col-12">
                            <ChatRoom
                                currentUserZCode={userZcode!}
                                currentUserName={studentName}
                                onlineUsers={currentState?.online_users || []}
                                initialMessages={currentState?.chat_messages || []}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Code Areas with Top-Bottom Layout */}
                <div className="col-lg-9">
                    <div className="row g-3">
                        {/* Teacher Demo + Terminal */}
                        <div className="col-12">
                            <div className="row g-2">
                                <div className="col-8">
                                    <CodeEditor
                                        documentKey="teacher-code"
                                        title="👨‍🏫 Teacher Demo"
                                        userRole="student"
                                        userZCode={studentZcode}
                                        readOnly={true}
                                        height="240px"
                                    />
                                </div>
                                <div className="col-4">
                                    <SimpleTerminal
                                        title="Teacher Output"
                                        results={teacherExecutionResults}
                                        onClear={clearTeacherResults}
                                        height="240px"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* My Practice + Terminal */}
                        <div className="col-12">
                            <div className="row g-2">
                                <div className="col-8">
                                    <CodeEditor
                                        documentKey={`student-${userZcode}`}
                                        title="✏️ My Practice"
                                        userRole="student"
                                        userZCode={studentZcode}
                                        onExecute={handleExecuteMyCode}
                                        height="280px"
                                    />
                                </div>
                                <div className="col-4">
                                    <SimpleTerminal
                                        title="My Output"
                                        results={myExecutionResults}
                                        onClear={clearMyResults}
                                        isExecuting={isExecutingMyCode}
                                        height="280px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="mt-4">
                <div className="card shadow-sm">
                    <div className="card-body py-2">
                        <div className="d-flex align-items-center justify-content-between text-sm">
                            <div className="d-flex align-items-center gap-4">
                                <span className="d-flex align-items-center text-muted">
                                    <div className="bg-success rounded-circle me-2" style={{width: '8px', height: '8px'}}></div>
                                    Connected to classroom
                                </span>
                                <span className="text-muted">
                                    Role: Student
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-4 text-muted">
                                <span>
                                    Teacher: {teacherName}
                                </span>
                                <span>
                                    {currentState?.online_count || 0} users online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export const StudentView: React.FC<StudentViewProps> = ({ classroomData }) => {
    return (
        <WebSocketProvider
            lectureId={classroomData.lecture_id}
            userZCode={classroomData.user_zcode}
            userRole="student"
            userName={classroomData.user_name}
        >
            <StudentViewContent classroomData={classroomData} />
        </WebSocketProvider>
    )
}