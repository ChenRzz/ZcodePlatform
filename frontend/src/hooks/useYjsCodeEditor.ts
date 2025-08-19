import { useEffect, useState, useRef, useCallback } from 'react'
import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { editor } from 'monaco-editor'
import { useWebSocketContext } from '../context/WebsocketContext.tsx'

interface UseYjsCodeEditorProps {
    documentKey: string
    userZCode: string
    userRole: 'teacher' | 'student'
}

interface UseYjsCodeEditorReturn {
    ydoc: Y.Doc
    isConnected: boolean
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
    bindToMonaco: (monacoEditor: editor.IStandaloneCodeEditor) => void
    getCurrentContent: () => string
    setInitialContent: (content: string) => void
    sendYjsSyncRequest: (documentKey: string) => void
    canEdit: boolean
    syncStatus: 'syncing' | 'synced' | 'conflict' | 'offline'
}


const globalYDocs = new Map<string, Y.Doc>()
const globalWebSocketHandlers = new Map<string, any>()


const getOrCreateYDoc = (documentKey: string): Y.Doc => {
    if (!globalYDocs.has(documentKey)) {
        const ydoc = new Y.Doc()

        try {
            const stored = localStorage.getItem(`ydoc_${documentKey}`)
            if (stored) {
                const data = JSON.parse(stored)
                if (data.update && Array.isArray(data.update)) {
                    const storedUpdate = new Uint8Array(data.update)
                    Y.applyUpdate(ydoc, storedUpdate, 'storage-load')
                    console.log(`[YJS Global] Restored YDoc for ${documentKey}`)
                }
            }
        } catch (error) {
            console.error('[YJS Global] Failed to restore YDoc:', error)
        }

        globalYDocs.set(documentKey, ydoc)
        console.log(`[YJS Global] Created YDoc for ${documentKey}`)
    }
    return globalYDocs.get(documentKey)!
}

const saveYDoc = (documentKey: string) => {
    const ydoc = globalYDocs.get(documentKey)
    if (ydoc) {
        try {
            const stateUpdate = Y.encodeStateAsUpdate(ydoc)
            const data = {
                update: Array.from(stateUpdate),
                timestamp: Date.now()
            }
            localStorage.setItem(`ydoc_${documentKey}`, JSON.stringify(data))
            console.log(`[YJS Global] Saved YDoc for ${documentKey}`)
        } catch (error) {
            console.error('[YJS Global] Save failed:', error)
        }
    }
}

export const useYjsCodeEditor = ({
                                     documentKey,
                                     userZCode,
                                     userRole
                                 }: UseYjsCodeEditorProps): UseYjsCodeEditorReturn => {

    const ydoc = getOrCreateYDoc(documentKey)

    const bindingRef = useRef<MonacoBinding | null>(null)
    const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'conflict' | 'offline'>('offline')
    const hasSyncedRef = useRef(false)

    const {
        isConnected,
        connectionStatus,
        subscribe,
        sendYjsUpdate,
        sendYjsSyncRequest,
        sendYjsSyncResponse
    } = useWebSocketContext()


    const canEdit = useCallback((): boolean => {
        if (!isConnected) return false
        if (userRole === 'teacher') return true
        if (userRole === 'student') {
            return documentKey === `student-${userZCode}` || documentKey === userZCode
        }
        return false
    }, [isConnected, userRole, documentKey, userZCode])

    const getCurrentContent = useCallback((): string => {
        return ydoc.getText(documentKey).toString()
    }, [ydoc, documentKey])

    const setInitialContent = useCallback((content: string) => {
        if (!content) return
        const currentContent = getCurrentContent()
        if (currentContent.length === 0) {
            console.log(`[YJS] Setting initial content for ${documentKey}`)
            const ytext = ydoc.getText(documentKey)
            ydoc.transact(() => {
                ytext.insert(0, content)
            }, 'initial')
        }
    }, [ydoc, documentKey, getCurrentContent])

    const bindToMonaco = useCallback((monacoEditor: editor.IStandaloneCodeEditor) => {
        console.log(`[YJS] Binding Monaco to ${documentKey}`)

        if (bindingRef.current) {
            bindingRef.current.destroy()
            bindingRef.current = null
        }

        const ytext = ydoc.getText(documentKey)
        const readOnly = !canEdit()

        monacoEditor.updateOptions({ readOnly })

        bindingRef.current = new MonacoBinding(
            ytext,
            monacoEditor.getModel()!,
            new Set([monacoEditor])
        )

        const content = ytext.toString()
        console.log(`[YJS] Bound ${documentKey}: ${content.length} chars, readOnly: ${readOnly}`)
    }, [ydoc, documentKey, canEdit])

    useEffect(() => {
        const ytext = ydoc.getText(documentKey)

        const handleTextUpdate = () => {
            console.log(`[YJS] Text update detected for ${documentKey}`)

            if (isConnected && canEdit()) {
                const docUpdate = Y.encodeStateAsUpdate(ydoc)
                console.log(`[YJS] Sending update for ${documentKey} (by ${userRole}:${userZCode})`)
                sendYjsUpdate(documentKey, docUpdate)
                setSyncStatus('synced')
            }
        }

        ytext.observe(handleTextUpdate)
        return () => {
            ytext.unobserve(handleTextUpdate)
        }
    }, [ydoc, documentKey, isConnected, canEdit, sendYjsUpdate, userRole, userZCode])


    useEffect(() => {
        const saveKey = `${documentKey}_save`

        if (!globalWebSocketHandlers.has(saveKey)) {
            const handleGlobalUpdate = ( origin: any) => {
                if (origin !== 'storage-load') {
                    setTimeout(() => saveYDoc(documentKey), 1000)
                }
            }

            ydoc.on('update', handleGlobalUpdate)
            globalWebSocketHandlers.set(saveKey, handleGlobalUpdate)

            return () => {
                ydoc.off('update', handleGlobalUpdate)
                globalWebSocketHandlers.delete(saveKey)
            }
        }
    }, [ydoc, documentKey])

    useEffect(() => {
        const unsubscribeUpdate = subscribe('yjs_update', (message) => {
            const data = message.data
            if (data.document_key === documentKey && data.update && data.update.length > 0) {
                console.log(`[YJS] Received update for ${documentKey} from ${message.sender}`)
                const remoteUpdate = new Uint8Array(data.update)
                Y.applyUpdate(ydoc, remoteUpdate, 'remote')
                setSyncStatus('synced')
            }
        })

        const unsubscribeSyncRequest = subscribe('yjs_sync_request', (message) => {
            const data = message.data
            if (data.document_key === documentKey && data.requester && data.requester !== userZCode) {
                console.log(`[YJS] Sync request for ${documentKey} from ${data.requester}`)
                const stateVector = Y.encodeStateAsUpdate(ydoc)
                sendYjsSyncResponse(documentKey, stateVector, data.requester)
            }
        })

        const unsubscribeSyncResponse = subscribe('yjs_sync_response', (message) => {
            const data = message.data
            if (data.document_key === documentKey && data.requester === userZCode) {
                console.log(`[YJS] Sync response for ${documentKey}`)
                if (data.update && data.update.length > 0) {
                    const syncUpdate = new Uint8Array(data.update)
                    Y.applyUpdate(ydoc, syncUpdate, 'sync')
                    console.log(`[YJS] Applied sync for ${documentKey}`)
                }
                setSyncStatus('synced')
            }
        })

        return () => {
            unsubscribeUpdate()
            unsubscribeSyncRequest()
            unsubscribeSyncResponse()
        }
    }, [documentKey, ydoc, subscribe, sendYjsSyncResponse, userZCode])


    useEffect(() => {
        if (isConnected) {
            console.log(`[YJS] Connected for ${documentKey}`)
            setSyncStatus('syncing')

            if (!hasSyncedRef.current) {
                const syncTimer = setTimeout(() => {
                    console.log(`[YJS] Requesting sync for ${documentKey}`)
                    sendYjsSyncRequest(documentKey)
                    hasSyncedRef.current = true
                    setTimeout(() => setSyncStatus('synced'), 1000)
                }, 500)

                return () => clearTimeout(syncTimer)
            }
        } else {
            console.log(`[YJS] Disconnected from ${documentKey}`)
            setSyncStatus('offline')
            hasSyncedRef.current = false
        }
    }, [isConnected, documentKey, sendYjsSyncRequest])


    useEffect(() => {
        if (bindingRef.current) {
            const readOnly = !canEdit()
            bindingRef.current.editors.forEach(editor => {
                editor.updateOptions({ readOnly })
            })
        }
    }, [canEdit])


    useEffect(() => {
        return () => {
            if (bindingRef.current) {
                bindingRef.current.destroy()
                bindingRef.current = null
            }
        }
    }, [])

    return {
        ydoc,
        isConnected,
        connectionStatus,
        bindToMonaco,
        getCurrentContent,
        setInitialContent,
        sendYjsSyncRequest,
        canEdit: canEdit(),
        syncStatus
    }
}
