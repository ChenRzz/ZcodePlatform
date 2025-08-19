import React, { useRef, useState, useEffect } from 'react'
import { Editor, useMonaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useYjsCodeEditor } from '../hooks/useYjsCodeEditor'
import { Play, Users, Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw, Lock, Eye, RotateCw } from 'lucide-react'

interface CodeEditorProps {
    documentKey: string
    title: string
    userRole: 'teacher' | 'student'
    userZCode: string
    readOnly?: boolean
    onExecute?: (code: string) => void
    height?: string
    initialContent?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
                                                          documentKey,
                                                          title,
                                                          userRole,
                                                          userZCode,
                                                          readOnly = false,
                                                          onExecute,
                                                          height = '400px',
                                                          initialContent = ''
                                                      }) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const [isExecuting, setIsExecuting] = useState(false)
    const [isEditorReady, setIsEditorReady] = useState(false)
    const [hasSetInitialContent, setHasSetInitialContent] = useState(false)

    console.log(`[CodeEditor] Rendering ${documentKey} for ${userRole}:${userZCode}`)

    const monaco = useMonaco()

    const {
        isConnected,
        connectionStatus,
        bindToMonaco,
        getCurrentContent,
        setInitialContent,
        sendYjsSyncRequest,
        canEdit,
        syncStatus
    } = useYjsCodeEditor({
        documentKey,
        userZCode,
        userRole
    })

    const finalReadOnly = readOnly || !canEdit

    useEffect(() => {
        if (monaco && isEditorReady) {
            console.log('[CodeEditor] Monaco available, configuring Python autocomplete')
            configurePythonAutocomplete(monaco)
        }
    }, [monaco, isEditorReady])

    const configurePythonAutocomplete = (monaco: any) => {
        try {
            monaco.languages.registerCompletionItemProvider('python', {
                provideCompletionItems: function (model: any, position: any) {
                    const word = model.getWordUntilPosition(position)
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    }

                    const suggestions = [
                        {
                            label: 'print',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'print(${1:value})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Python print function',
                            detail: 'Built-in function',
                            range: range
                        },
                        {
                            label: 'def',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'def ${1:name}(${2:args}):\n    ${0:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Define a function',
                            detail: 'Keyword',
                            range: range
                        },
                        {
                            label: 'if',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'if ${1:condition}:\n    ${0:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'If statement',
                            detail: 'Keyword',
                            range: range
                        },
                        {
                            label: 'for',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'for ${1:item} in ${2:iterable}:\n    ${0:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'For loop',
                            detail: 'Keyword',
                            range: range
                        },
                        {
                            label: 'while',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'while ${1:condition}:\n    ${0:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'While loop',
                            detail: 'Keyword',
                            range: range
                        },
                        {
                            label: 'len',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'len(${1:obj})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Return the length of an object',
                            detail: 'Built-in function',
                            range: range
                        },
                        {
                            label: 'range',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'range(${1:start}, ${2:stop})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Generate a range of numbers',
                            detail: 'Built-in function',
                            range: range
                        },
                        {
                            label: 'input',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'input(${1:"prompt"})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Read input from user',
                            detail: 'Built-in function',
                            range: range
                        }
                    ]

                    return { suggestions }
                }
            })
        } catch (error) {
            console.error('[CodeEditor] Error registering completion provider:', error)
        }
    }

    useEffect(() => {
        if (isEditorReady && isConnected && initialContent && !hasSetInitialContent) {
            const currentContent = getCurrentContent()
            if (currentContent.length === 0) {
                console.log(`[CodeEditor] Setting initial content for ${documentKey}`)
                setInitialContent(initialContent)
                setHasSetInitialContent(true)
            }
        }
    }, [isEditorReady, isConnected, initialContent, hasSetInitialContent, getCurrentContent, setInitialContent, documentKey])

    const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
        console.log(`[CodeEditor] Monaco editor mounted for ${documentKey}`)
        editorRef.current = editorInstance


        editorInstance.updateOptions({
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            readOnly: finalReadOnly,
            theme: 'vs-dark',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            folding: true,
            matchBrackets: 'always',
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: false,
        })

        bindToMonaco(editorInstance)
        setIsEditorReady(true)

        console.log(`[CodeEditor] Ready for ${documentKey}, readOnly: ${finalReadOnly}`)
    }

    const handleExecute = async () => {
        if (!onExecute || isExecuting || !isConnected || !canEdit) return

        setIsExecuting(true)
        try {
            const code = getCurrentContent()
            console.log(`[CodeEditor] Executing code for ${documentKey}`)
            await onExecute(code)
        } catch (error) {
            console.error('[CodeEditor] Code execution failed:', error)
        } finally {
            setIsExecuting(false)
        }
    }

    const handleForceSync = () => {
        console.log(`[CodeEditor] Force syncing ${documentKey}`)
        sendYjsSyncRequest(documentKey)
    }

    const getConnectionIcon = () => {
        switch (connectionStatus) {
            case 'connected':
                return <Wifi size={16} className="text-success" />
            case 'connecting':
                return <div className="spinner-border spinner-border-sm text-warning" style={{ width: '16px', height: '16px' }} />
            case 'error':
                return <AlertCircle size={16} className="text-danger" />
            default:
                return <WifiOff size={16} className="text-danger" />
        }
    }

    const getConnectionText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'Connected'
            case 'connecting':
                return 'Connecting...'
            case 'error':
                return 'Error'
            default:
                return 'Disconnected'
        }
    }

    const getConnectionTextClass = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'text-success'
            case 'connecting':
                return 'text-warning'
            case 'error':
                return 'text-danger'
            default:
                return 'text-danger'
        }
    }

    const getSyncStatusIcon = () => {
        switch (syncStatus) {
            case 'synced':
                return <CheckCircle size={14} className="text-success" />
            case 'syncing':
                return <RotateCw size={14} className="text-warning animate-spin" />
            case 'conflict':
                return <AlertCircle size={14} className="text-warning" />
            case 'offline':
                return <WifiOff size={14} className="text-secondary" />
            default:
                return <AlertCircle size={14} className="text-secondary" />
        }
    }

    const getSyncStatusText = () => {
        switch (syncStatus) {
            case 'synced':
                return 'Synced'
            case 'syncing':
                return 'Syncing...'
            case 'conflict':
                return 'Conflict'
            case 'offline':
                return 'Offline'
            default:
                return 'Unknown'
        }
    }

    const getPermissionIcon = () => {
        if (userRole === 'teacher') {
            return <Users size={16} className="text-primary" />
        }

        if (finalReadOnly) {
            if (!isConnected) {
                return <Lock size={16} className="text-danger" />
            }
            return <Eye size={16} className="text-warning" />
        }

        return <CheckCircle size={16} className="text-success" />
    }

    const getStatusBadges = () => {
        const badges = []

        if (finalReadOnly) {
            if (!isConnected) {
                badges.push(<span key="offline" className="badge bg-danger text-xs">Offline</span>)
            } else if (!canEdit) {
                badges.push(<span key="readonly" className="badge bg-warning text-xs">View Only</span>)
            } else {
                badges.push(<span key="forced-readonly" className="badge bg-secondary text-xs">Read Only</span>)
            }
        }

        return badges
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <h5 className="card-title mb-0">{title}</h5>
                        {getPermissionIcon()}
                        {getStatusBadges()}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* 同步状态 */}
                        <div className="d-flex align-items-center gap-1">
                            {getSyncStatusIcon()}
                            <small className="text-muted">
                                {getSyncStatusText()}
                            </small>
                        </div>

                        {/* connection status */}
                        <div className="d-flex align-items-center gap-1">
                            {getConnectionIcon()}
                            <small className={getConnectionTextClass()}>
                                {getConnectionText()}
                            </small>
                        </div>

                        {/* syc button */}
                        <button
                            onClick={handleForceSync}
                            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                            title="Force sync document"
                            disabled={!isConnected}
                        >
                            <RefreshCw size={14} />
                        </button>

                        {/* execute button */}
                        {onExecute && (
                            <button
                                onClick={handleExecute}
                                disabled={!isConnected || !isEditorReady || isExecuting || finalReadOnly}
                                className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                title={
                                    !isConnected
                                        ? 'Not connected'
                                        : !isEditorReady
                                            ? 'Editor not ready'
                                            : finalReadOnly
                                                ? 'No edit permission'
                                                : 'Execute code'
                                }
                            >
                                {isExecuting ? (
                                    <div className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }} />
                                ) : (
                                    <Play size={14} />
                                )}
                                <span className="ms-1">Execute</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                <div style={{ height }}>
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        onMount={handleEditorDidMount}
                        loading={
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="text-center">
                                    <div className="spinner-border text-primary mb-2" />
                                    <div className="text-muted">Loading Python editor...</div>
                                </div>
                            </div>
                        }
                        options={{
                            readOnly: finalReadOnly,
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            lineNumbers: 'on',
                            cursorBlinking: 'smooth',
                            renderWhitespace: 'selection',
                            folding: true,
                            matchBrackets: 'always',
                            tabSize: 4,
                            insertSpaces: true,
                            detectIndentation: false,
                        }}
                    />
                </div>
            </div>

            {/* status */}
            {(connectionStatus === 'error' || (!isConnected && connectionStatus !== 'connecting')) && (
                <div className="card-footer bg-light py-2">
                    <small className="text-danger d-flex align-items-center gap-1">
                        <AlertCircle size={12} />
                        Connection lost. Document is read-only until reconnected.
                    </small>
                </div>
            )}

            {connectionStatus === 'connecting' && (
                <div className="card-footer bg-light py-2">
                    <small className="text-warning d-flex align-items-center gap-1">
                        <div className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
                        Connecting to classroom...
                    </small>
                </div>
            )}

            {syncStatus === 'syncing' && isConnected && (
                <div className="card-footer bg-light py-2">
                    <small className="text-info d-flex align-items-center gap-1">
                        <RotateCw size={12} className="animate-spin" />
                        Synchronizing document...
                    </small>
                </div>
            )}

            {syncStatus === 'conflict' && (
                <div className="card-footer bg-light py-2">
                    <small className="text-warning d-flex align-items-center gap-1">
                        <AlertCircle size={12} />
                        Document conflicts detected. Auto-resolving...
                    </small>
                </div>
            )}
        </div>
    )
}