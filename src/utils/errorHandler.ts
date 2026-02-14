// 统一错误处理机制
export interface AppError {
  code: string
  message: string
  userMessage: string
  details?: Record<string, any>
  timestamp: Date
  stack?: string
}

export class BadmintonAppError extends Error implements AppError {
  public readonly code: string
  public readonly userMessage: string
  public readonly details?: Record<string, any>
  public readonly timestamp: Date

  constructor(
    code: string,
    message: string,
    userMessage: string,
    details?: Record<string, any>
  ) {
    super(message)
    this.name = 'BadmintonAppError'
    this.code = code
    this.userMessage = userMessage
    this.details = details
    this.timestamp = new Date()
  }
}

// 错误处理器类
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorListeners: Array<(error: AppError) => void> = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // 添加错误监听器
  addErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener)
  }

  // 移除错误监听器
  removeErrorListener(listener: (error: AppError) => void): void {
    const index = this.errorListeners.indexOf(listener)
    if (index > -1) {
      this.errorListeners.splice(index, 1)
    }
  }

  // 处理错误
  handle(error: unknown): AppError {
    const appError = this.normalizeError(error)
    
    // 记录错误日志
    this.logError(appError)
    
    // 通知所有监听器
    this.errorListeners.forEach(listener => {
      try {
        listener(appError)
      } catch (e) {
        console.error('Error in error listener:', e)
      }
    })

    return appError
  }

  // 标准化错误
  private normalizeError(error: unknown): AppError {
    if (error instanceof BadmintonAppError) {
      return error
    }

    if (error instanceof Error) {
      return new BadmintonAppError(
        'UNKNOWN_ERROR',
        error.message,
        '发生了未知错误，请稍后重试',
        { originalError: error.name, stack: error.stack }
      )
    }

    if (typeof error === 'string') {
      return new BadmintonAppError(
        'STRING_ERROR',
        error,
        '操作失败，请稍后重试'
      )
    }

    return new BadmintonAppError(
      'UNKNOWN_ERROR',
      'Unknown error occurred',
      '发生了未知错误，请稍后重试',
      { originalError: error }
    )
  }

  // 记录错误日志
  private logError(error: AppError): void {
    const logData = {
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      details: error.details,
      timestamp: error.timestamp,
      stack: error.stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    }

    // 开发环境下打印到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', logData)
    }

    // 生产环境下可以发送到日志服务
    if (process.env.NODE_ENV === 'production') {
      // TODO: 发送到日志服务 (如 Sentry, LogRocket 等)
      // this.sendToLoggingService(logData)
    }
  }

  // 创建特定类型的错误
  static createNetworkError(message: string = '网络连接失败'): BadmintonAppError {
    return new BadmintonAppError(
      'NETWORK_ERROR',
      'Network request failed',
      message
    )
  }

  static createValidationError(field: string, message: string): BadmintonAppError {
    return new BadmintonAppError(
      'VALIDATION_ERROR',
      `Validation failed for field: ${field}`,
      message,
      { field }
    )
  }

  static createNotFoundError(resource: string): BadmintonAppError {
    return new BadmintonAppError(
      'NOT_FOUND',
      `${resource} not found`,
      `找不到${resource}，请检查后重试`
    )
  }

  static createPermissionError(action: string): BadmintonAppError {
    return new BadmintonAppError(
      'PERMISSION_DENIED',
      `Permission denied for action: ${action}`,
      '您没有权限执行此操作'
    )
  }
}

// 全局错误处理器实例
export const errorHandler = ErrorHandler.getInstance()

// React Hook for error handling
import { useCallback } from 'react'

export function useErrorHandler() {
  const handleError = useCallback((error: unknown) => {
    return errorHandler.handle(error)
  }, [])

  const createError = useCallback((
    code: string,
    message: string,
    userMessage: string,
    details?: Record<string, any>
  ) => {
    return new BadmintonAppError(code, message, userMessage, details)
  }, [])

  return {
    handleError,
    createError,
    createNetworkError: ErrorHandler.createNetworkError,
    createValidationError: ErrorHandler.createValidationError,
    createNotFoundError: ErrorHandler.createNotFoundError,
    createPermissionError: ErrorHandler.createPermissionError
  }
}

// Toast 通知系统
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export class ToastManager {
  private static instance: ToastManager
  private toasts: ToastMessage[] = []
  private listeners: Array<(toasts: ToastMessage[]) => void> = []

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager()
    }
    return ToastManager.instance
  }

  addListener(listener: (toasts: ToastMessage[]) => void): void {
    this.listeners.push(listener)
  }

  removeListener(listener: (toasts: ToastMessage[]) => void): void {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  show(toast: Omit<ToastMessage, 'id'>): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 3000
    }

    this.toasts.push(newToast)
    this.notify()

    // 自动移除
    if (newToast.duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, newToast.duration)
    }

    return id
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  clear(): void {
    this.toasts = []
    this.notify()
  }

  success(title: string, message?: string): string {
    return this.show({ type: 'success', title, message })
  }

  error(title: string, message?: string): string {
    return this.show({ type: 'error', title, message })
  }

  warning(title: string, message?: string): string {
    return this.show({ type: 'warning', title, message })
  }

  info(title: string, message?: string): string {
    return this.show({ type: 'info', title, message })
  }
}

export const toastManager = ToastManager.getInstance()

// React Hook for toast
import { useState, useEffect } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handleToastsChange = (newToasts: ToastMessage[]) => {
      setToasts(newToasts)
    }

    toastManager.addListener(handleToastsChange)
    return () => {
      toastManager.removeListener(handleToastsChange)
    }
  }, [])

  return {
    toasts,
    showToast: toastManager.show.bind(toastManager),
    removeToast: toastManager.remove.bind(toastManager),
    clearToasts: toastManager.clear.bind(toastManager),
    success: toastManager.success.bind(toastManager),
    error: toastManager.error.bind(toastManager),
    warning: toastManager.warning.bind(toastManager),
    info: toastManager.info.bind(toastManager)
  }
}