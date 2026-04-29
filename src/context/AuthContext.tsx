'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IUser } from '../types'
import api from '../lib/api'

interface AuthContextType {
  user: IUser | null
  token: string | null
  isLoading: boolean
  login: (user: IUser, token: string) => void
  logout: () => void
  setToken: (token: string) => void
  setUser: (user: IUser) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setToken: () => {},
  setUser: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken) setTokenState(storedToken)
        if (storedUser) setUserState(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse auth data from localStorage', error)
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (newUser: IUser, newToken: string) => {
    setUserState(newUser)
    setTokenState(newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('accessToken', newToken)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUserState(null)
      setTokenState(null)
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
  }

  const setToken = (newToken: string) => {
    setTokenState(newToken)
    localStorage.setItem('accessToken', newToken)
  }

  const setUser = (newUser: IUser) => {
    setUserState(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
