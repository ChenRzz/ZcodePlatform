import React, { useEffect, useRef } from 'react'
import { Terminal, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

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

interface SimpleTerminalProps {
    title: string
    results: ExecutionResult[]
    onClear: () => void
    isExecuting?: boolean
    height?: string
}

export const SimpleTerminal: React.FC<SimpleTerminalProps> = ({
                                                                  title,
                                                                  results,
                                                                  onClear,
                                                                  isExecuting = false,
                                                                  height = '400px'
                                                              }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
        }
    }, [results])

    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const getStatusIcon = (result: ExecutionResult) => {
        switch (result.status) {
            case 'running':
                return <div className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
            case 'completed':
                return <CheckCircle size={12} className="text-success" />
            case 'failed':
                return <XCircle size={12} className="text-danger" />
            case 'timeout':
                return <AlertTriangle size={12} className="text-warning" />
            default:
                return null
        }
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-light py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0 d-flex align-items-center">
                        <Terminal size={16} className="me-2" />
                        {title}
                        {isExecuting && (
                            <div className="ms-2 spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
                        )}
                    </h6>
                    <button
                        onClick={onClear}
                        className="btn btn-outline-secondary btn-sm"
                        disabled={results.length === 0}
                        title="Clear"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="card-body p-0"
                style={{ height, overflowY: 'auto' }}
            >
                {results.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                        <Terminal size={32} className="mb-2 opacity-50" />
                        <small>No output yet</small>
                    </div>
                ) : (
                    <div>
                        {results.map((result, index) => (
                            <div key={result.id} className="border-bottom p-2">
                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="d-flex align-items-center gap-1">
                                        {getStatusIcon(result)}
                                        {/* 🔥 修复：按执行顺序显示序号，从1开始递增 */}
                                        <small className="text-muted">#{index + 1}</small>
                                    </div>
                                    <small className="text-muted">{formatTime(result.executed_at)}</small>
                                </div>

                                {/* Content */}
                                {result.status === 'running' ? (
                                    <div className="bg-light rounded p-2">
                                        <small className="text-muted">Running...</small>
                                    </div>
                                ) : (
                                    <>
                                        {/* Output */}
                                        {result.output && (
                                            <pre className="bg-dark text-light rounded p-2 mb-1 small" style={{
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                fontFamily: 'monospace',
                                                fontSize: '11px',
                                                lineHeight: '1.3',
                                                margin: 0
                                            }}>
                                                {result.output}
                                            </pre>
                                        )}

                                        {/* Error */}
                                        {result.error && (
                                            <pre className="bg-danger-subtle text-danger rounded p-2 mb-1 small" style={{
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                fontFamily: 'monospace',
                                                fontSize: '11px',
                                                lineHeight: '1.3',
                                                margin: 0
                                            }}>
                                                {result.error}
                                            </pre>
                                        )}

                                        {/* No output */}
                                        {!result.output && !result.error && result.status === 'completed' && (
                                            <div className="bg-light rounded p-2">
                                                <small className="text-muted">✓ No output</small>
                                            </div>
                                        )}

                                        {/* Timeout */}
                                        {result.status === 'timeout' && (
                                            <div className="bg-warning-subtle rounded p-2">
                                                <small className="text-warning">⚠ Timeout</small>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}