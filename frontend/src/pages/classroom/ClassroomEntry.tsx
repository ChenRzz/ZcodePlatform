import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { classroomService } from '../../services/classroom_apis'
import { useUser } from '../../context/UserContext'
import type { JoinClassroomResponse } from '../../types/classroom'
import { TeacherView } from './TeacherView.tsx'
import { StudentView } from './StudentView.tsx'
import { AlertTriangle, RefreshCw, ArrowLeft, Wifi, Users, BookOpen } from 'lucide-react'

export const ClassroomEntry: React.FC = () => {
    const { lectureId, lecturerZcode } = useParams<{
        lectureId: string
        lecturerZcode: string
    }>()

    const navigate = useNavigate()
    const { userZcode, username } = useUser()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [classroomData, setClassroomData] = useState<JoinClassroomResponse | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [isRetrying, setIsRetrying] = useState(false)

    const maxRetries = 3

    const joinClassroom = async (isRetry = false) => {
        if (!lectureId || !lecturerZcode) {
            setError('Invalid classroom link. Missing lecture ID or lecturer code.')
            setLoading(false)
            return
        }

        if (!userZcode || !username) {
            setError('Please login first to join the classroom.')
            setLoading(false)
            return
        }

        try {
            if (isRetry) {
                setIsRetrying(true)
            } else {
                setLoading(true)
            }
            setError(null)

            console.log(`User ${username}(${userZcode}) attempting to join classroom ${lectureId} with teacher ${lecturerZcode}`)

            const response = await classroomService.joinClassroom(
                parseInt(lectureId),
                userZcode,
                lecturerZcode,
                username
            )

            setClassroomData(response)
            setRetryCount(0)
            console.log(`Successfully joined classroom, role: ${response.user_role}`)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to join classroom'
            setError(errorMessage)
            console.error('Failed to join classroom:', errorMessage)

            if (isRetry) {
                setRetryCount(prev => prev + 1)
            }
        } finally {
            setLoading(false)
            setIsRetrying(false)
        }
    }

    useEffect(() => {
        joinClassroom()
    }, [lectureId, lecturerZcode, userZcode, username])

    const handleRetry = () => {
        joinClassroom(true)
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleGoHome = () => {
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center" style={{ maxWidth: '400px' }}>
                    <div className="card shadow-sm">
                        <div className="card-body p-5">
                            {/* Loading animation */}
                            <div className="mb-4">
                                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>

                            {/* Connection steps */}
                            <h4 className="text-primary mb-3">Joining Classroom</h4>
                            <div className="text-start">
                                <div className="d-flex align-items-center mb-2">
                                    <Wifi size={16} className="text-success me-2" />
                                    <small className="text-muted">Connecting to server...</small>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <Users size={16} className="text-primary me-2" />
                                    <small className="text-muted">Authenticating user...</small>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <BookOpen size={16} className="text-secondary me-2" />
                                    <small className="text-muted">Setting up classroom...</small>
                                </div>
                            </div>

                            {/* User and classroom info */}
                            <div className="bg-light rounded p-3">
                                <div className="small text-muted">
                                    <div><strong>User:</strong> {username} ({userZcode})</div>
                                    <div><strong>Lecture:</strong> #{lectureId}</div>
                                    <div><strong>Teacher:</strong> {lecturerZcode}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center" style={{ maxWidth: '500px' }}>
                    <div className="card shadow-sm">
                        <div className="card-body p-5">
                            {/* Error icon */}
                            <div className="mb-4">
                                <AlertTriangle size={64} className="text-warning" />
                            </div>

                            <h2 className="text-danger mb-3">Connection Failed</h2>

                            {/* Error message */}
                            <div className="alert alert-danger text-start mb-4">
                                <strong>Error:</strong> {error}
                            </div>

                            {/* Retry information */}
                            {retryCount > 0 && (
                                <div className="alert alert-warning text-start mb-4">
                                    <small>
                                        <strong>Retry attempts:</strong> {retryCount} of {maxRetries}
                                    </small>
                                </div>
                            )}

                            {/* Connection details */}
                            <div className="bg-light rounded p-3 mb-4">
                                <div className="small text-muted text-start">
                                    <div><strong>User:</strong> {username} ({userZcode})</div>
                                    <div><strong>Lecture ID:</strong> #{lectureId}</div>
                                    <div><strong>Teacher:</strong> {lecturerZcode}</div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="d-grid gap-2">
                                {retryCount < maxRetries ? (
                                    <button
                                        onClick={handleRetry}
                                        disabled={isRetrying}
                                        className="btn btn-primary d-flex align-items-center justify-content-center"
                                    >
                                        {isRetrying ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" />
                                                Retrying...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw size={16} className="me-2" />
                                                Try Again ({maxRetries - retryCount} attempts left)
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="alert alert-danger">
                                        <small>Maximum retry attempts reached. Please check your connection and try again later.</small>
                                    </div>
                                )}

                                <button
                                    onClick={handleGoBack}
                                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                                >
                                    <ArrowLeft size={16} className="me-2" />
                                    Go Back
                                </button>

                                <button
                                    onClick={handleGoHome}
                                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                >
                                    Go to Home
                                </button>
                            </div>

                            {/* Troubleshooting tips */}
                            <div className="mt-4">
                                <details className="text-start">
                                    <summary className="text-muted small" style={{ cursor: 'pointer' }}>
                                        Troubleshooting Tips
                                    </summary>
                                    <div className="mt-2 small text-muted">
                                        <ul className="mb-0">
                                            <li>Check your internet connection</li>
                                            <li>Verify the classroom link is correct</li>
                                            <li>Make sure the lecturer has started the classroom</li>
                                            <li>Try refreshing the page</li>
                                            <li>Contact your instructor if the problem persists</li>
                                        </ul>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!classroomData) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-danger mb-3" />
                    <p className="text-muted">Something went wrong. Please refresh the page.</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="classroom-container">
            {classroomData.user_role === 'teacher' ? (
                <TeacherView classroomData={classroomData} />
            ) : (
                <StudentView classroomData={classroomData} />
            )}
        </div>
    )
}