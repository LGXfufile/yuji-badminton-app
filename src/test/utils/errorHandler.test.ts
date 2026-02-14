import { ErrorHandler, BadmintonAppError, ToastManager } from '@/utils/errorHandler'

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance()
    // Clear any existing listeners
    errorHandler['errorListeners'] = []
  })

  describe('Error Creation', () => {
    it('creates network error correctly', () => {
      const error = ErrorHandler.createNetworkError('网络连接失败')
      
      expect(error).toBeInstanceOf(BadmintonAppError)
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.userMessage).toBe('网络连接失败')
    })

    it('creates validation error correctly', () => {
      const error = ErrorHandler.createValidationError('email', '邮箱格式不正确')
      
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.userMessage).toBe('邮箱格式不正确')
      expect(error.details?.field).toBe('email')
    })

    it('creates not found error correctly', () => {
      const error = ErrorHandler.createNotFoundError('用户')
      
      expect(error.code).toBe('NOT_FOUND')
      expect(error.userMessage).toBe('找不到用户，请检查后重试')
    })

    it('creates permission error correctly', () => {
      const error = ErrorHandler.createPermissionError('删除比赛')
      
      expect(error.code).toBe('PERMISSION_DENIED')
      expect(error.userMessage).toBe('您没有权限执行此操作')
    })
  })

  describe('Error Handling', () => {
    it('handles BadmintonAppError correctly', () => {
      const originalError = new BadmintonAppError(
        'TEST_ERROR',
        'Test message',
        'Test user message'
      )
      
      const handledError = errorHandler.handle(originalError)
      
      expect(handledError).toBe(originalError)
      expect(handledError.code).toBe('TEST_ERROR')
    })

    it('normalizes regular Error correctly', () => {
      const originalError = new Error('Regular error message')
      
      const handledError = errorHandler.handle(originalError)
      
      expect(handledError).toBeInstanceOf(BadmintonAppError)
      expect(handledError.code).toBe('UNKNOWN_ERROR')
      expect(handledError.message).toBe('Regular error message')
      expect(handledError.userMessage).toBe('发生了未知错误，请稍后重试')
    })

    it('normalizes string error correctly', () => {
      const handledError = errorHandler.handle('String error message')
      
      expect(handledError.code).toBe('STRING_ERROR')
      expect(handledError.message).toBe('String error message')
      expect(handledError.userMessage).toBe('操作失败，请稍后重试')
    })

    it('normalizes unknown error correctly', () => {
      const handledError = errorHandler.handle({ unknown: 'object' })
      
      expect(handledError.code).toBe('UNKNOWN_ERROR')
      expect(handledError.userMessage).toBe('发生了未知错误，请稍后重试')
    })
  })

  describe('Error Listeners', () => {
    it('adds and calls error listeners', () => {
      const listener = jest.fn()
      errorHandler.addErrorListener(listener)
      
      const error = new Error('Test error')
      errorHandler.handle(error)
      
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(expect.any(BadmintonAppError))
    })

    it('removes error listeners correctly', () => {
      const listener = jest.fn()
      errorHandler.addErrorListener(listener)
      errorHandler.removeErrorListener(listener)
      
      const error = new Error('Test error')
      errorHandler.handle(error)
      
      expect(listener).not.toHaveBeenCalled()
    })

    it('handles listener errors gracefully', () => {
      const faultyListener = jest.fn().mockImplementation(() => {
        throw new Error('Listener error')
      })
      const goodListener = jest.fn()
      
      errorHandler.addErrorListener(faultyListener)
      errorHandler.addErrorListener(goodListener)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const error = new Error('Test error')
      errorHandler.handle(error)
      
      expect(faultyListener).toHaveBeenCalled()
      expect(goodListener).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('Error in error listener:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})

describe('ToastManager', () => {
  let toastManager: ToastManager

  beforeEach(() => {
    toastManager = ToastManager.getInstance()
    toastManager.clear()
    toastManager['listeners'] = []
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Toast Management', () => {
    it('shows toast correctly', () => {
      const listener = jest.fn()
      toastManager.addListener(listener)
      
      const id = toastManager.show({
        type: 'success',
        title: 'Success message',
        message: 'Operation completed'
      })
      
      expect(id).toBeTruthy()
      expect(listener).toHaveBeenCalledWith([
        expect.objectContaining({
          id,
          type: 'success',
          title: 'Success message',
          message: 'Operation completed'
        })
      ])
    })

    it('removes toast correctly', () => {
      const listener = jest.fn()
      toastManager.addListener(listener)
      
      const id = toastManager.show({
        type: 'info',
        title: 'Info message'
      })
      
      toastManager.remove(id)
      
      expect(listener).toHaveBeenLastCalledWith([])
    })

    it('auto-removes toast after duration', () => {
      const listener = jest.fn()
      toastManager.addListener(listener)
      
      toastManager.show({
        type: 'warning',
        title: 'Warning message',
        duration: 1000
      })
      
      expect(listener).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'warning',
          title: 'Warning message'
        })
      ])
      
      jest.advanceTimersByTime(1000)
      
      expect(listener).toHaveBeenLastCalledWith([])
    })

    it('provides convenience methods', () => {
      const listener = jest.fn()
      toastManager.addListener(listener)
      
      toastManager.success('Success title', 'Success message')
      toastManager.error('Error title')
      toastManager.warning('Warning title')
      toastManager.info('Info title')
      
      expect(listener).toHaveBeenCalledTimes(4)
    })

    it('clears all toasts', () => {
      const listener = jest.fn()
      toastManager.addListener(listener)
      
      toastManager.success('Toast 1')
      toastManager.error('Toast 2')
      
      toastManager.clear()
      
      expect(listener).toHaveBeenLastCalledWith([])
    })
  })

  describe('Listener Management', () => {
    it('adds and removes listeners correctly', () => {
      const listener1 = jest.fn()
      const listener2 = jest.fn()
      
      toastManager.addListener(listener1)
      toastManager.addListener(listener2)
      
      toastManager.success('Test message')
      
      expect(listener1).toHaveBeenCalled()
      expect(listener2).toHaveBeenCalled()
      
      toastManager.removeListener(listener1)
      
      toastManager.error('Another message')
      
      expect(listener2).toHaveBeenCalledTimes(2)
      expect(listener1).toHaveBeenCalledTimes(1) // Still only called once
    })
  })
})