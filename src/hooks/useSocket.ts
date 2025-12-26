'use client'
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(path?: string, token?: string, handlers?: (socket: Socket) => void) {
  const sockRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token) return
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      path: path ?? '/',
      transports: ['websocket'],
    })
    sockRef.current = socket
    if (handlers) handlers(socket)
    return () => {
      socket.disconnect()
      sockRef.current = null
    }
  }, [token, path, handlers])

  return sockRef
}
