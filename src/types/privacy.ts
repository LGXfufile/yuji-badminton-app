// 隐私设置相关类型定义
export type PrivacyLevel = 'public' | 'circle' | 'private'

export interface UserPrivacySettings {
  // 全局隐私级别 (快速设置)
  globalLevel: PrivacyLevel
  
  // 细粒度模块控制
  modules: {
    profile: PrivacyLevel      // 个人资料 (昵称、头像、等级等)
    matches: PrivacyLevel      // 比赛记录 (具体比赛详情)
    statistics: PrivacyLevel   // 统计数据 (胜率、场次等)
    achievements: PrivacyLevel // 成就系统 (解锁的成就)
    ranking: PrivacyLevel      // 排行榜参与 (是否显示在排行榜)
    equipment: PrivacyLevel    // 装备信息 (球拍、球鞋等)
    social: PrivacyLevel       // 社交信息 (微信、微博等)
  }
  
  // 高级设置
  advanced: {
    allowFriendRequests: boolean    // 是否允许好友申请
    showOnlineStatus: boolean       // 是否显示在线状态
    allowDataExport: boolean        // 是否允许数据导出
    searchable: boolean            // 是否可被搜索到
  }
}

// 圈子相关类型定义
export interface Circle {
  id: string
  name: string
  description: string
  avatar: string
  type: 'club' | 'friends' | 'location' | 'interest' | 'school' | 'company'
  privacy: 'public' | 'invite_only' | 'approval_required'
  memberCount: number
  maxMembers: number
  location?: string
  tags: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  
  // 圈子设置
  settings: {
    allowInvites: boolean          // 成员是否可以邀请他人
    requireApproval: boolean       // 加入是否需要审核
    allowEvents: boolean           // 是否允许创建活动
    allowRanking: boolean          // 是否参与圈子排行榜
  }
  
  // 圈子统计
  stats: {
    activeMembers: number          // 活跃成员数
    totalMatches: number           // 圈子内总比赛数
    eventsCount: number           // 活动数量
    avgLevel: number              // 平均技术等级
  }
}

// 圈子成员关系
export interface CircleMembership {
  circleId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending' | 'banned'
  joinedAt: Date
  invitedBy?: string
  
  // 圈子内个性化设置
  circleProfile: {
    nickname?: string             // 圈子内昵称
    bio?: string                 // 圈子内简介
    customAvatar?: string        // 圈子内专用头像
  }
  
  // 权限设置
  permissions: {
    canInvite: boolean           // 可以邀请新成员
    canCreateEvents: boolean     // 可以创建活动
    canModerate: boolean         // 可以管理内容
  }
}

// 隐私级别描述
export const PRIVACY_LEVELS = {
  public: {
    label: '公开',
    description: '所有用户可见，参与全局排行榜',
    icon: '🌍',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  circle: {
    label: '圈子可见',
    description: '仅圈子成员可见，参与圈子排行榜',
    icon: '👥',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  private: {
    label: '仅自己',
    description: '完全私密，只有自己可见',
    icon: '🔒',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
} as const

// 圈子类型描述
export const CIRCLE_TYPES = {
  club: {
    label: '俱乐部',
    description: '基于真实羽毛球俱乐部',
    icon: '🏢',
    color: 'text-blue-600'
  },
  friends: {
    label: '好友圈',
    description: '私人朋友圈子',
    icon: '👥',
    color: 'text-green-600'
  },
  location: {
    label: '地区圈',
    description: '基于地理位置的圈子',
    icon: '📍',
    color: 'text-red-600'
  },
  interest: {
    label: '兴趣圈',
    description: '基于共同兴趣爱好',
    icon: '🎯',
    color: 'text-purple-600'
  },
  school: {
    label: '校园圈',
    description: '学校内部圈子',
    icon: '🏫',
    color: 'text-orange-600'
  },
  company: {
    label: '企业圈',
    description: '公司内部圈子',
    icon: '🏢',
    color: 'text-indigo-600'
  }
} as const

// 默认隐私设置
export const DEFAULT_PRIVACY_SETTINGS: UserPrivacySettings = {
  globalLevel: 'public',
  modules: {
    profile: 'public',
    matches: 'public',
    statistics: 'public',
    achievements: 'public',
    ranking: 'public',
    equipment: 'circle',
    social: 'private'
  },
  advanced: {
    allowFriendRequests: true,
    showOnlineStatus: true,
    allowDataExport: true,
    searchable: true
  }
}

// 隐私检查工具函数
export const checkPrivacyAccess = (
  userPrivacy: UserPrivacySettings,
  module: keyof UserPrivacySettings['modules'],
  viewerContext: {
    isOwner: boolean
    isInSameCircle: boolean
    isPublicViewer: boolean
  }
): boolean => {
  const { isOwner, isInSameCircle, isPublicViewer } = viewerContext
  
  // 用户自己总是可以查看
  if (isOwner) return true
  
  const modulePrivacy = userPrivacy.modules[module]
  
  switch (modulePrivacy) {
    case 'public':
      return true
    case 'circle':
      return isInSameCircle
    case 'private':
      return false
    default:
      return false
  }
}