import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/errorHandling'

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  
  const { signIn, signUp, resetPassword, loading, error } = useAuth()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setMessage('')

    // Валидация
    if (!validateEmail(email)) {
      setFormError('Пожалуйста, введите корректный email адрес')
      return
    }

    if (!validatePassword(password)) {
      setFormError('Пароль должен содержать минимум 6 символов')
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setFormError('Пароли не совпадают')
      return
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) {
          setFormError(getErrorMessage(error))
        } else {
          setMessage('Проверьте вашу почту для подтверждения регистрации!')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setFormError(getErrorMessage(error))
        }
      }
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setFormError('')
    setMessage('')

    if (!validateEmail(email)) {
      setFormError('Пожалуйста, введите корректный email адрес')
      return
    }

    const { error } = await resetPassword(email)
    if (error) {
      setFormError(getErrorMessage(error))
    } else {
      setMessage('Инструкции по сбросу пароля отправлены на вашу почту!')
      setShowResetPassword(false)
    }
  }

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Сброс пароля
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Введите ваш email для получения инструкций по сбросу пароля
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email адрес
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {formError && (
              <div className="text-red-600 text-sm text-center">
                {formError}
              </div>
            )}

            {message && (
              <div className="text-green-600 text-sm text-center">
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправка...' : 'Отправить инструкции'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Вернуться к входу
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            🎯 Transcribe.Cafe
          </h1>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            {isSignUp ? 'Создать аккаунт' : 'Войти в систему'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp 
              ? 'Зарегистрируйтесь для доступа к сервису транскрипции'
              : 'Войдите в ваш аккаунт для продолжения'
            }
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email адрес
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {(formError || error) && (
            <div className="text-red-600 text-sm text-center">
              {formError || error}
            </div>
          )}

          {message && (
            <div className="text-green-600 text-sm text-center">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Загрузка...' : (isSignUp ? 'Зарегистрироваться' : 'Войти')}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setFormError('')
                setMessage('')
              }}
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Забыли пароль?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthForm