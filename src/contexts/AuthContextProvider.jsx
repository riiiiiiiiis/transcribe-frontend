import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Получаем текущую сессию при загрузке
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Ошибка получения сессии:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Слушаем изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        // Обработка различных событий аутентификации
        switch (event) {
          case 'SIGNED_IN':
            setSession(session)
            setUser(session?.user ?? null)
            setError(null)
            break
          case 'SIGNED_OUT':
            setSession(null)
            setUser(null)
            setError(null)
            break
          case 'TOKEN_REFRESHED':
            setSession(session)
            setUser(session?.user ?? null)
            console.log('Токен обновлен автоматически')
            break
          case 'USER_UPDATED':
            setSession(session)
            setUser(session?.user ?? null)
            break
          default:
            setSession(session)
            setUser(session?.user ?? null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Вход в систему
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Ошибка входа:', error)
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Регистрация
  const signUp = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Выход из системы
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  // Сброс пароля
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Ошибка сброса пароля:', error)
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}