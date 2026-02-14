// 应用配置常量
export const APP_CONFIG = {
  // 时间相关
  LOADING_DELAY: 1000,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  
  // 重试相关
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // 分页相关
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // 文件上传
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // UI相关
  MODAL_Z_INDEX: 1000,
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 280,
  
  // 数据限制
  MAX_MATCH_NOTES_LENGTH: 500,
  MAX_CIRCLE_NAME_LENGTH: 50,
  MAX_CIRCLE_DESCRIPTION_LENGTH: 200,
  
  // 缓存相关
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟
  LOCAL_STORAGE_PREFIX: 'yuji_',
  
  // API相关
  API_TIMEOUT: 10000,
  REQUEST_TIMEOUT: 30000,
} as const

// 错误代码常量
export const ERROR_CODES = {
  // 网络错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 认证错误
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // 业务错误
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  MATCH_NOT_FOUND: 'MATCH_NOT_FOUND',
  CIRCLE_NOT_FOUND: 'CIRCLE_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // 系统错误
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

// 用户等级配置
export const USER_LEVELS = {
  MIN_LEVEL: 1,
  MAX_LEVEL: 10,
  LEVEL_NAMES: {
    1: '新手',
    2: '入门',
    3: '初级',
    4: '中级',
    5: '中高级',
    6: '高级',
    7: '专业',
    8: '精英',
    9: '大师',
    10: '传奇'
  }
} as const

// 比赛类型配置
export const MATCH_TYPES = {
  SINGLES: 'singles',
  DOUBLES: 'doubles',
  MIXED: 'mixed'
} as const

// 圈子类型配置
export const CIRCLE_TYPES_CONFIG = {
  CLUB: 'club',
  FRIENDS: 'friends',
  LOCATION: 'location',
  INTEREST: 'interest',
  SCHOOL: 'school',
  COMPANY: 'company'
} as const

// 隐私级别配置
export const PRIVACY_LEVELS_CONFIG = {
  PUBLIC: 'public',
  CIRCLE: 'circle',
  PRIVATE: 'private'
} as const