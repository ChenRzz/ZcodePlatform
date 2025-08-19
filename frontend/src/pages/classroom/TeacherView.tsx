import React, { useState, useEffect } from 'react'
import { classroomService } from '../../services/classroom_apis'
import type { JoinClassroomResponse, ClassroomState } from '../../types/classroom'
import { useUser } from '../../context/UserContext'
import { useWebSocketContext, WebSocketProvider } from '../../context/WebsocketContext.tsx'
import { CodeEditor } from '../../components/CodeEditor'
import { ChatRoom } from '../../components/ChatRoom'
import { UserList } from '../../components/Userlist.tsx'
import { SimpleTerminal } from '../../components/SimpleTerminal'
import { Users, Code, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'

interface TeacherViewProps {
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

const TeacherViewContent: React.FC<TeacherViewProps> = ({ classroomData }) => {
    const { userZcode } = useUser()
    const lectureId = classroomData.lecture_id
    const teacherZcode = classroomData.user_zcode
    const teacherName = classroomData.user_name
    const lectureName=classroomData.lecture_name

    const [currentState, setCurrentState] = useState<ClassroomState | null>(null)
    const [selectedStudentZCode, setSelectedStudentZCode] = useState<string | null>(null)
    const [teacherExecutionResults, setTeacherExecutionResults] = useState<ExecutionResult[]>([])
    const [studentExecutionResults, setStudentExecutionResults] = useState<ExecutionResult[]>([])
    const [isLoadingState, setIsLoadingState] = useState(true)
    const [stateError, setStateError] = useState<string | null>(null)
    const [showStudentCode, setShowStudentCode] = useState(true)
    const [isExecutingTeacherCode, setIsExecutingTeacherCode] = useState(false)
    const [hasInitializedTeacherCode, setHasInitializedTeacherCode] = useState(false)
    const { sendStudentExecution } = useWebSocketContext()


    const { sendTeacherExecution, subscribe } = useWebSocketContext()

    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                setIsLoadingState(true)
                setStateError(null)
                const state = await classroomService.getClassroomState(lectureId, userZcode!)
                setCurrentState(state)
                console.log('[TeacherView] Initial classroom state loaded:', state)

                setHasInitializedTeacherCode(true)

                const students = state.online_users?.filter(user => user.role === 'student') || []
                if (students.length > 0 && !selectedStudentZCode) {
                    setSelectedStudentZCode(students[0].zcode)
                }
            } catch (error) {
                console.error('[TeacherView] Failed to fetch initial classroom state:', error)
                setStateError(error instanceof Error ? error.message : 'Failed to load classroom state')
            } finally {
                setIsLoadingState(false)
            }
        }

        fetchInitialState()
    }, [lectureId, userZcode, selectedStudentZCode])

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const newState = await classroomService.getClassroomState(lectureId, userZcode!)
                setCurrentState(prev => {
                    if (!prev || prev.online_count !== newState.online_count ||
                        prev.chat_messages?.length !== newState.chat_messages?.length) {
                        console.log('[TeacherView] Classroom state updated via polling')
                        return newState
                    }
                    return prev
                })
            } catch (error) {
                console.error('[TeacherView] Failed to refresh classroom state:', error)
            }
        }, 12000)

        return () => clearInterval(interval)
    }, [lectureId, userZcode])

    useEffect(() => {
        const unsubscribe = subscribe('student_execution', (message) => {
            console.log('[TeacherView] Received student execution:', message)
            const executionResult = message.data
            if (selectedStudentZCode && message.sender === selectedStudentZCode) {
                setStudentExecutionResults(prev => [...prev, executionResult])
                console.log('[TeacherView] Added student execution result from:', message.sender)
            } else {
                console.log('[TeacherView] Ignoring execution from:', message.sender, 'selected:', selectedStudentZCode)
            }
        })

        return unsubscribe
    }, [subscribe, selectedStudentZCode])

    const handleExecuteTeacherCode = async (code: string) => {
        try {
            setIsExecutingTeacherCode(true)
            console.log('[TeacherView] Executing teacher demo code:', code.substring(0, 100) + '...')

            const result = await classroomService.executeCode(lectureId, teacherZcode, code, 'teacher')

            const executionResult: ExecutionResult = {
                id: result.id,
                output: result.output,
                error: result.error,
                duration_ms: result.duration_ms,
                executed_at: Date.now() / 1000,
                executor: teacherName,
                status: result.status,
                exit_code: result.exit_code
            }

            setTeacherExecutionResults(prev => [...prev, executionResult])

            sendTeacherExecution(executionResult)

        } catch (error) {
            console.error('[TeacherView] Code execution failed:', error)

            const errorResult: ExecutionResult = {
                id: `error_${Date.now()}_${Math.random()}`,
                output: '',
                error: error instanceof Error ? error.message : 'Execution failed',
                duration_ms: 0,
                executed_at: Date.now() / 1000,
                executor: teacherName,
                status: 'failed',
                exit_code: 1
            }
            setTeacherExecutionResults(prev => [...prev, errorResult])
        } finally {
            setIsExecutingTeacherCode(false)
        }
    }

    const handleExecuteStudentCode = async (code: string) => {
        if (!selectedStudentZCode || !selectedStudent) return

        try {
            console.log('[TeacherView] Teacher executing student code for:', selectedStudent.name)

            const result = await classroomService.executeCode(lectureId, selectedStudentZCode, code, 'student')

            const executionResult: ExecutionResult = {
                id: result.id,
                output: result.output,
                error: result.error,
                duration_ms: result.duration_ms,
                executed_at: Date.now() / 1000,
                executor: selectedStudent.name,
                status: result.status,
                exit_code: result.exit_code
            }

            setStudentExecutionResults(prev => [...prev, executionResult])

            sendStudentExecution(executionResult, selectedStudentZCode)

            console.log('[TeacherView] Sent execution result to student:', selectedStudentZCode)

        } catch (error) {
            console.error('[TeacherView] Student code execution failed:', error)

            const errorResult: ExecutionResult = {
                id: `error_${Date.now()}_${Math.random()}`,
                output: '',
                error: error instanceof Error ? error.message : 'Execution failed',
                duration_ms: 0,
                executed_at: Date.now() / 1000,
                executor: selectedStudent?.name || selectedStudentZCode,
                status: 'failed',
                exit_code: 1
            }

            setStudentExecutionResults(prev => [...prev, errorResult])

            sendStudentExecution(errorResult, selectedStudentZCode)
        }
    }

    const handleStudentSelect = (studentZCode: string) => {
        console.log('[TeacherView] Selected student:', studentZCode)
        setSelectedStudentZCode(studentZCode)
        setShowStudentCode(true)
        setStudentExecutionResults([])
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

    const clearStudentResults = () => {
        setStudentExecutionResults([])
    }

    const toggleStudentCodeView = () => {
        setShowStudentCode(!showStudentCode)
    }

    const students = currentState?.online_users?.filter(user => user.role === 'student') || []
    const selectedStudent = students.find(student => student.zcode === selectedStudentZCode)

    if (isLoadingState && !currentState) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-success mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Setting up classroom...</p>
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
                                        🎓 {lectureName} #{lectureId}
                                    </h1>
                                    <p className="text-muted mb-0">
                                        Teacher: {teacherName} ({teacherZcode}) | Online: {currentState?.online_count || 0} users |
                                        Students: {students.length}
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-success fs-6">Teacher</span>
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
                {/* Left Column - Students & Chat */}
                <div className="col-lg-3">
                    <div className="row g-4">
                        {/* User List */}
                        <div className="col-12">
                            <UserList
                                currentUserZCode={userZcode!}
                                currentUserRole="teacher"
                                selectedStudentZCode={selectedStudentZCode}
                                onStudentSelect={handleStudentSelect}
                                initialUsers={currentState?.online_users || []}
                            />
                        </div>

                        {/* Chat Room */}
                        <div className="col-12">
                            <ChatRoom
                                currentUserZCode={userZcode!}
                                currentUserName={teacherName}
                                onlineUsers={currentState?.online_users || []}
                                initialMessages={currentState?.chat_messages || []}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Code Areas with Top-Bottom Layout */}
                <div className="col-lg-9">
                    <div className="row g-3">
                        {/* Teacher Code + Terminal */}
                        <div className="col-12">
                            <div className="row g-2">
                                <div className="col-8">
                                    <CodeEditor
                                        documentKey="teacher-code"
                                        title="📖 Teacher Demo"
                                        userRole="teacher"
                                        userZCode={teacherZcode}
                                        onExecute={handleExecuteTeacherCode}
                                        height="240px"
                                        initialContent={!hasInitializedTeacherCode ? "# Welcome to Python class!\nprint('Hello, students!')\n\n# Today's lesson: Functions\ndef calculate_area(length, width):\n    return length * width\n\n# Example\narea = calculate_area(5, 3)\nprint(f'Area: {area}')" : ""}
                                    />
                                </div>
                                <div className="col-4">
                                    <SimpleTerminal
                                        title="Teacher Output"
                                        results={teacherExecutionResults}
                                        onClear={clearTeacherResults}
                                        isExecuting={isExecutingTeacherCode}
                                        height="240px"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student Code + Terminal */}
                        <div className="col-12">
                            {selectedStudentZCode && showStudentCode ? (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="text-muted mb-0">
                                            {selectedStudent?.name || selectedStudentZCode}'s Code
                                        </h6>
                                        <button
                                            onClick={toggleStudentCodeView}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            <EyeOff size={14} className="me-1" />
                                            Hide
                                        </button>
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-8">
                                            <CodeEditor
                                                key={`student-${selectedStudentZCode}`}
                                                documentKey={`student-${selectedStudentZCode}`}
                                                title={`👨‍🎓 ${selectedStudent?.name || selectedStudentZCode}`}
                                                userRole="teacher"
                                                readOnly={false}
                                                userZCode={teacherZcode}
                                                onExecute={handleExecuteStudentCode}
                                                height="280px"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <SimpleTerminal
                                                title="Student Output"
                                                results={studentExecutionResults}
                                                onClear={clearStudentResults}
                                                height="280px"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="card shadow-sm" style={{ height: '310px' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <div className="text-center text-muted">
                                            {selectedStudentZCode && !showStudentCode ? (
                                                <div>
                                                    <EyeOff size={48} className="mb-3 opacity-50" />
                                                    <p className="mb-2">Student code hidden</p>
                                                    <button
                                                        onClick={toggleStudentCodeView}
                                                        className="btn btn-outline-primary btn-sm"
                                                    >
                                                        <Eye size={14} className="me-1" />
                                                        Show {selectedStudent?.name || selectedStudentZCode}'s Code
                                                    </button>
                                                </div>
                                            ) : students.length === 0 ? (
                                                <div>
                                                    <Users size={48} className="mb-3 opacity-50" />
                                                    <p className="mb-0">No students online</p>
                                                    <small>Students' code will appear here when they join</small>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Code size={48} className="mb-3 opacity-50" />
                                                    <p className="mb-0">Select a student to view their code</p>
                                                    <small>Click on a student name in the user list</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Bar */}
            <div className="mt-4">
                <div className="card shadow-sm">
                    <div className="card-body py-2">
                        <div className="d-flex align-items-center justify-content-between text-sm">
                            <div className="d-flex align-items-center gap-4">
                                <span className="d-flex align-items-center text-muted">
                                    <div className="bg-success rounded-circle me-2" style={{width: '8px', height: '8px'}}></div>
                                    Classroom active
                                </span>
                                <span className="text-muted">
                                    Role: Teacher
                                </span>
                                {selectedStudentZCode && (
                                    <span className="text-muted">
                                        Monitoring: {selectedStudent?.name || selectedStudentZCode}
                                    </span>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-4 text-muted">
                                <span>
                                    {students.length} students active
                                </span>
                                <span>
                                    Total: {currentState?.online_count || 0} users
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const TeacherView: React.FC<TeacherViewProps> = ({ classroomData }) => {
    return (
        <WebSocketProvider
            lectureId={classroomData.lecture_id}
            userZCode={classroomData.user_zcode}
            userRole="teacher"
            userName={classroomData.user_name}
        >
            <TeacherViewContent classroomData={classroomData} />
        </WebSocketProvider>
    )
}