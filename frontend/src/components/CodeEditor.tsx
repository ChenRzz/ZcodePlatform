import React, { useRef, useState, useEffect } from 'react'
import { Editor, useMonaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useYjsCodeEditor } from '../hooks/useYjsCodeEditor'
import { Play, Users, Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

interface CodeEditorProps {
    documentKey: string
    title: string
    userRole: 'teacher' | 'student'
    readOnly?: boolean
    onExecute?: (code: string) => void
    height?: string
    initialContent?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
                                                          documentKey,
                                                          title,
                                                          userRole,
                                                          readOnly = false,
                                                          onExecute,
                                                          height = '400px',
                                                          initialContent = ''
                                                      }) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const [isExecuting, setIsExecuting] = useState(false)
    const [isEditorReady, setIsEditorReady] = useState(false)
    const [currentDocumentKey, setCurrentDocumentKey] = useState(documentKey)

    const monaco = useMonaco()

    const {
        isConnected,
        connectionStatus,
        bindToMonaco,
        getCurrentContent,
        setInitialContent,
        sendYjsSyncRequest
    } = useYjsCodeEditor({
        documentKey
    })


    useEffect(() => {
        if (monaco && isEditorReady) {
            console.log('[CodeEditor] Monaco is available, configuring Python autocomplete')
            configurePythonAutocomplete(monaco)
        }
    }, [monaco, isEditorReady])


    const configurePythonAutocomplete = (monaco: any) => {
        console.log('[CodeEditor] Configuring Python autocomplete...')

        try {

            monaco.languages.registerCompletionItemProvider('python', {
                provideCompletionItems: function (model: any, position: any) {
                    console.log('[CodeEditor] Providing completions at position:', position)

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

                    console.log('[CodeEditor] Returning', suggestions.length, 'suggestions')
                    return { suggestions }
                }
            })

            console.log('[CodeEditor] Python completion provider registered successfully')

        } catch (error) {
            console.error('[CodeEditor] Error registering completion provider:', error)
        }
    }


    useEffect(() => {
        if (currentDocumentKey !== documentKey && isEditorReady && editorRef.current) {
            console.log(`[CodeEditor] Document key changed from ${currentDocumentKey} to ${documentKey}`)
            setCurrentDocumentKey(documentKey)


            bindToMonaco(editorRef.current)


        }
    }, [documentKey, currentDocumentKey, isEditorReady, bindToMonaco])

    useEffect(() => {
        if (isEditorReady && isConnected && initialContent && currentDocumentKey === documentKey) {
            const timer = setTimeout(() => {
                const currentContent = getCurrentContent()
                if (currentContent.length === 0) {
                    console.log(`[CodeEditor] Setting initial content for ${documentKey} after sync delay`)
                    setInitialContent(initialContent)
                }
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [isEditorReady, isConnected, initialContent, currentDocumentKey, documentKey, getCurrentContent, setInitialContent])

    const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
        console.log(`[CodeEditor] Monaco editor mounted for ${documentKey}`)
        editorRef.current = editorInstance

        editorInstance.updateOptions({
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            readOnly,
            theme: 'vs-dark',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection'
        })

        bindToMonaco(editorInstance)
        setIsEditorReady(true)

        console.log(`[CodeEditor] Ready for ${documentKey}, readOnly: ${readOnly}`)
    }

    const handleExecute = async () => {
        if (!onExecute || isExecuting || !isConnected) return

        setIsExecuting(true)
        try {
            const code = getCurrentContent()
            console.log(`[CodeEditor] Executing code for ${documentKey}:`, code.substring(0, 100) + '...')
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

    const getRoleIcon = () => {
        if (userRole === 'teacher') {
            return <Users size={16} className="text-primary" />
        }
        return null
    }

    const getStatusIcon = () => {
        if (!isEditorReady) {
            return <div className="spinner-border spinner-border-sm text-secondary" style={{ width: '14px', height: '14px' }} />
        }
        if (isConnected && isEditorReady) {
            return <CheckCircle size={14} className="text-success" />
        }
        return <AlertCircle size={14} className="text-warning" />
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <h5 className="card-title mb-0">{title}</h5>
                        {getRoleIcon()}
                        {readOnly && (
                            <span className="badge bg-secondary text-xs">Read Only</span>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* Editor Status */}
                        <div className="d-flex align-items-center gap-1">
                            {getStatusIcon()}
                            <small className="text-muted">
                                {!isEditorReady ? 'Loading...' : 'Ready'}
                            </small>
                        </div>

                        {/* Connection Status */}
                        <div className="d-flex align-items-center gap-1">
                            {getConnectionIcon()}
                            <small className={getConnectionTextClass()}>
                                {getConnectionText()}
                            </small>
                        </div>

                        {/* Force Sync Button */}
                        <button
                            onClick={handleForceSync}
                            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                            title="Force sync document"
                            disabled={!isConnected}
                        >
                            <RefreshCw size={14} />
                        </button>

                        {/* Execute Button */}
                        {onExecute && (
                            <button
                                onClick={handleExecute}
                                disabled={!isConnected || !isEditorReady || isExecuting || readOnly}
                                className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                title={
                                    !isConnected
                                        ? 'Not connected'
                                        : !isEditorReady
                                            ? 'Editor not ready'
                                            : readOnly
                                                ? 'Read only mode'
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
                            readOnly,
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

            {/* Footer with additional info */}
            {(connectionStatus === 'error' || (!isConnected && connectionStatus !== 'connecting')) && (
                <div className="card-footer bg-light py-2">
                    <small className="text-danger d-flex align-items-center gap-1">
                        <AlertCircle size={12} />
                        Connection lost. Attempting to reconnect...
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
        </div>
    )
}