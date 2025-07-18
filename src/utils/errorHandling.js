// Утилиты для обработки ошибок

export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return translateErrorMessage(error)
  }
  
  if (error?.message) {
    return translateErrorMessage(error.message)
  }
  
  return 'Произошла неожиданная ошибка'
}

export const translateErrorMessage = (message) => {
  const errorTranslations = {
    // Supabase Auth ошибки
    'Invalid login credentials': 'Неверный email или пароль',
    'Email not confirmed': 'Пожалуйста, подтвердите ваш email адрес',
    'Password should be at least': 'Пароль должен содержать минимум 6 символов',
    'User already registered': 'Пользователь с таким email уже зарегистрирован',
    'Signup requires a valid password': 'Требуется валидный пароль для регистрации',
    'Unable to validate email address': 'Невозможно проверить email адрес',
    'Email rate limit exceeded': 'Превышен лимит отправки email. Попробуйте позже',
    'Invalid email': 'Неверный формат email адреса',
    'Weak password': 'Слишком слабый пароль',
    
    // API ошибки
    'Failed to fetch': 'Ошибка сети. Проверьте подключение к интернету',
    'Network request failed': 'Ошибка сети. Проверьте подключение к интернету',
    'Сессия истекла. Пожалуйста, войдите в систему снова.': 'Сессия истекла. Пожалуйста, войдите в систему снова.',
    'Доступ запрещен': 'Доступ запрещен',
    
    // Общие ошибки
    'Something went wrong': 'Что-то пошло не так',
    'Server error': 'Ошибка сервера',
    'Timeout': 'Превышено время ожидания'
  }
  
  // Ищем точное совпадение
  if (errorTranslations[message]) {
    return errorTranslations[message]
  }
  
  // Ищем частичное совпадение
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (message.includes(key)) {
      return value
    }
  }
  
  return message
}

export const isNetworkError = (error) => {
  const networkErrorMessages = [
    'Failed to fetch',
    'Network request failed',
    'NetworkError',
    'ERR_NETWORK',
    'ERR_INTERNET_DISCONNECTED'
  ]
  
  const errorMessage = typeof error === 'string' ? error : error?.message || ''
  return networkErrorMessages.some(msg => errorMessage.includes(msg))
}

export const isAuthError = (error) => {
  const authErrorMessages = [
    'Invalid login credentials',
    'Email not confirmed',
    'User already registered',
    'Сессия истекла',
    'Доступ запрещен',
    'Token',
    'Unauthorized'
  ]
  
  const errorMessage = typeof error === 'string' ? error : error?.message || ''
  return authErrorMessages.some(msg => errorMessage.includes(msg))
}