import { useEffect, useState, useRef, useCallback } from 'react'
import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { editor } from 'monaco-editor'
import { useWebSocketContext } from '../context/WebsocketContext.tsx'

interface UseYjsCodeEditorProps {
    documentKey: string
}

interface UseYjsCodeEditorReturn {
    ydoc: Y.Doc
    isConnected: boolean
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
    bindToMonaco: (monacoEditor: editor.IStandaloneCodeEditor) => void
    getCurrentContent: () => string
    setInitialContent: (content: string) => void
    sendYjsSyncRequest: (documentKey: string) => void
}

export const useYjsCodeEditor = ({
                                     documentKey
                                 }: UseYjsCodeEditorProps): UseYjsCodeEditorReturn => {
    const [ydoc] = useState(() => new Y.Doc())
    const bindingRef = useRef<MonacoBinding | null>(null)
    const isInitializedRef = useRef(false)
    const currentDocumentKeyRef = useRef(documentKey)

    const {
        isConnected,
        connectionStatus,
        subscribe,
        sendYjsUpdate,
        sendYjsSyncRequest,
        sendYjsSyncResponse
    } = useWebSocketContext()

    const getCurrentContent = useCallback((): string => {
        const ytext = ydoc.getText(documentKey)
        return ytext.toString()
    }, [ydoc, documentKey])

    const setInitialContent = useCallback((content: string) => {
        if (!content) return

        const currentContent = getCurrentContent()
        console.log(`[YJS] setInitialContent called for ${documentKey}, current length: ${currentContent.length}, new content length: ${content.length}`)

        if (currentContent.length === 0) {
            console.log(`[YJS] Setting initial content for empty document: ${documentKey}`)
            const ytext = ydoc.getText(documentKey)
            ydoc.transact(() => {
                ytext.insert(0, content)
            }, 'initial')
        } else if (currentContent === content) {
            console.log(`[YJS] Content already matches initial content for ${documentKey}, skipping`)
        } else {
            console.log(`[YJS] Document ${documentKey} has content (${currentContent.length} chars), not setting initial content`)
        }
    }, [ydoc, documentKey, getCurrentContent])

    const bindToMonaco = useCallback((monacoEditor: editor.IStandaloneCodeEditor) => {
        console.log(`[YJS] Binding Monaco editor to YJS document: ${documentKey}`)

        if (bindingRef.current) {
            console.log(`[YJS] Destroying previous binding`)
            bindingRef.current.destroy()
            bindingRef.current = null
        }
        const ytext = ydoc.getText(documentKey)

        bindingRef.current = new MonacoBinding(
            ytext,
            monacoEditor.getModel()!,
            new Set([monacoEditor])
        )

        console.log(`[YJS] Monaco editor bound to ${documentKey}, content length: ${ytext.length}`)
    }, [ydoc, documentKey])

    useEffect(() => {
        if (currentDocumentKeyRef.current !== documentKey) {
            console.log(`[YJS] Document key changed from ${currentDocumentKeyRef.current} to ${documentKey}`)
            currentDocumentKeyRef.current = documentKey
            isInitializedRef.current = false
            const ytext = ydoc.getText(documentKey)
            if (ytext.length > 0) {
                ydoc.transact(() => {
                    ytext.delete(0, ytext.length)
                }, 'reset')
            }

            if (isConnected) {
                console.log(`[YJS] Requesting sync for new document: ${documentKey}`)
                sendYjsSyncRequest(documentKey)
                isInitializedRef.current = true
            }
        }
    }, [documentKey, isConnected, sendYjsSyncRequest, ydoc])

    useEffect(() => {
        const unsubscribeUpdate = subscribe('yjs_update', (message) => {
            const data = message.data
            if (data.document_key === documentKey && data.update && data.update.length > 0) {
                console.log(`[YJS] Applying update for ${documentKey} from ${message.sender}`)
                const update = new Uint8Array(data.update)
                Y.applyUpdate(ydoc, update, 'remote')
            }
        })

        const unsubscribeSyncRequest = subscribe('yjs_sync_request', (message) => {
            const data = message.data
            if (data.document_key === documentKey && data.requester) {
                console.log(`[YJS] Received sync request for ${documentKey} from ${data.requester}`)
                const stateVector = Y.encodeStateAsUpdate(ydoc)
                sendYjsSyncResponse(documentKey, stateVector, data.requester)
            }
        })

        const unsubscribeSyncResponse = subscribe('yjs_sync_response', (message) => {
            const data = message.data
            if (data.document_key === documentKey && data.requester) {
                console.log(`[YJS] Received sync response for ${documentKey}, requester: ${data.requester}, data size: ${data.update?.length || 0}`)
                if (data.update && data.update.length > 0) {
                    const update = new Uint8Array(data.update)
                    Y.applyUpdate(ydoc, update, 'remote')
                    console.log(`[YJS] Applied sync response, document now has ${ydoc.getText(documentKey).length} characters`)
                } else {
                    console.log(`[YJS] Sync response has no update data for ${documentKey}`)
                }
            }
        })

        return () => {
            unsubscribeUpdate()
            unsubscribeSyncRequest()
            unsubscribeSyncResponse()
        }
    }, [documentKey, ydoc, subscribe, sendYjsSyncResponse])

    useEffect(() => {
        const handleUpdate = (update: Uint8Array, origin: any) => {
            if (origin !== 'remote' && isConnected) {
                console.log(`[YJS] Sending update for ${documentKey}`)
                sendYjsUpdate(documentKey, update)
            }
        }

        ydoc.on('update', handleUpdate)

        return () => {
            ydoc.off('update', handleUpdate)
        }
    }, [ydoc, documentKey, isConnected, sendYjsUpdate])

    useEffect(() => {
        if (isConnected && !isInitializedRef.current) {
            console.log(`[YJS] Requesting initial sync for ${documentKey}`)

            const syncTimeout = setTimeout(() => {
                sendYjsSyncRequest(documentKey)
                isInitializedRef.current = true
            }, 500)

            return () => clearTimeout(syncTimeout)
        }
    }, [isConnected, documentKey, sendYjsSyncRequest])

    useEffect(() => {
        if (isConnected && isInitializedRef.current) {
            const retryTimeout = setTimeout(() => {
                const currentContent = getCurrentContent()
                if (currentContent.length === 0) {
                    console.log(`[YJS] No content received, retrying sync for ${documentKey}`)
                    sendYjsSyncRequest(documentKey)
                }
            }, 3000)

            return () => clearTimeout(retryTimeout)
        }
    }, [isConnected, documentKey, sendYjsSyncRequest, getCurrentContent])

    useEffect(() => {
        if (!isConnected) {
            isInitializedRef.current = false
        }
    }, [isConnected])
    
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
        sendYjsSyncRequest
    }
}