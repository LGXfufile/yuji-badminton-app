import { create } from 'zustand'
import { User, Match, UserStats } from '@/types'
import { UserPrivacySettings, DEFAULT_PRIVACY_SETTINGS, checkPrivacyAccess } from '@/types/privacy'

// 导出圈子相关的 store
export { useCircleStore } from './circle'

interface UserState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
  privacySettings: UserPrivacySettings
  
  // Actions
  setUser: (user: User) => void
  updateUserStats: (stats: Partial<UserStats>) => void
  updatePrivacySettings: (settings: Partial<UserPrivacySettings>) => void
  login: () => Promise<void>
  logout: () => void
  clearError: () => void
  
  // Privacy check helpers
  canViewUserData: (module: keyof UserPrivacySettings['modules'], viewerContext: {
    isOwner: boolean
    isInSameCircle: boolean
    isPublicViewer: boolean
  }) => boolean
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  privacySettings: DEFAULT_PRIVACY_SETTINGS,

  setUser: (user: User) => {
    set({ user, isLoggedIn: true, error: null })
  },

  updateUserStats: (stats: Partial<UserStats>) => {
    const { user } = get()
    if (user) {
      set({
        user: {
          ...user,
          stats: { ...user.stats, ...stats }
        }
      })
    }
  },

  updatePrivacySettings: (settings: Partial<UserPrivacySettings>) => {
    const newSettings = { ...get().privacySettings, ...settings }
    set({ privacySettings: newSettings })
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPrivacySettings', JSON.stringify(newSettings))
    }
  },

  login: async () => {
    set({ loading: true, error: null })
    try {
      // 模拟登录 - 在Web环境下使用模拟数据
      const mockUser: User = {
        _id: 'mock_user_id',
        _openid: 'mock_openid',
        nickname: '羽毛球达人',
        avatarUrl: '/images/default-avatar.svg',
        level: 5,
        stats: {
          totalMatches: 12,
          totalWins: 9,
          winRate: 0.75,
          currentStreak: 3,
          bestStreak: 5,
          weeklyGoal: 4,
          trends: {
            weeklyTrend: 0.18,
            monthlyTrend: 0.12,
            skillImprovement: 0.25
          }
        },
        equipment: [
          {
            id: 'racket_1',
            type: 'racket',
            brand: 'YONEX',
            model: 'ARCSABER 11',
            purchaseDate: new Date('2024-01-15'),
            usageCount: 45
          },
          {
            id: 'shoes_1',
            type: 'shoes',
            brand: 'VICTOR',
            model: 'SH-A922',
            purchaseDate: new Date('2024-03-20'),
            usageCount: 30
          }
        ],
        settings: {
          privacy: 'public',
          notifications: {
            matchReminder: true,
            weeklyReport: true,
            achievements: true
          },
          theme: 'light'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      set({
        user: mockUser,
        isLoggedIn: true,
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '登录失败'
      })
    }
  },

  logout: () => {
    set({
      user: null,
      isLoggedIn: false,
      error: null
    })
  },

  clearError: () => {
    set({ error: null })
  }
}))

interface MatchState {
  matches: Match[]
  currentMatch: Match | null
  loading: boolean
  error: string | null
  
  // Actions
  setMatches: (matches: Match[]) => void
  addMatch: (match: Match) => void
  updateMatch: (matchId: string, updates: Partial<Match>) => void
  deleteMatch: (matchId: string) => void
  setCurrentMatch: (match: Match | null) => void
  loadMatches: () => Promise<void>
  saveMatch: (match: Omit<Match, '_id' | 'createdAt'>) => Promise<void>
  clearError: () => void
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  currentMatch: null,
  loading: false,
  error: null,

  setMatches: (matches: Match[]) => {
    set({ matches, error: null })
  },

  addMatch: (match: Match) => {
    const { matches } = get()
    set({ matches: [match, ...matches] })
  },

  updateMatch: (matchId: string, updates: Partial<Match>) => {
    const { matches } = get()
    const updatedMatches = matches.map(match =>
      match._id === matchId ? { ...match, ...updates } : match
    )
    set({ matches: updatedMatches })
  },

  deleteMatch: (matchId: string) => {
    const { matches } = get()
    const filteredMatches = matches.filter(match => match._id !== matchId)
    set({ matches: filteredMatches })
  },

  setCurrentMatch: (match: Match | null) => {
    set({ currentMatch: match })
  },

  loadMatches: async () => {
    set({ loading: true, error: null })
    try {
      // 丰富的测试数据
      const mockMatches: Match[] = [
        {
          _id: 'match_1',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['张三']
          },
          score: {
            teamA: 21,
            teamB: 18
          },
          winner: 'teamA',
          duration: 45,
          venue: '奥体中心羽毛球馆',
          date: new Date(),
          notes: '今天状态不错，发球和网前技术都有提升',
          tags: ['单打', '胜利', '技术提升'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date()
        },
        {
          _id: 'match_2',
          type: 'doubles',
          players: {
            teamA: ['羽毛球爱好者', '李四'],
            teamB: ['王五', '赵六']
          },
          score: {
            teamA: 19,
            teamB: 21
          },
          winner: 'teamB',
          duration: 52,
          venue: '市体育馆',
          date: new Date(Date.now() - 86400000),
          notes: '配合还需要加强，下次要多练习双打战术',
          tags: ['双打', '失败', '需要改进'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          _id: 'match_3',
          type: 'mixed',
          players: {
            teamA: ['羽毛球爱好者', '小红'],
            teamB: ['小明', '小丽']
          },
          score: {
            teamA: 21,
            teamB: 15
          },
          winner: 'teamA',
          duration: 38,
          venue: '大学体育馆',
          date: new Date(Date.now() - 2 * 86400000),
          notes: '混双配合很默契，女搭档网前技术很好',
          tags: ['混双', '胜利', '配合默契'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 2 * 86400000)
        },
        {
          _id: 'match_4',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['老王']
          },
          score: {
            teamA: 21,
            teamB: 12
          },
          winner: 'teamA',
          duration: 35,
          venue: '社区活动中心',
          date: new Date(Date.now() - 3 * 86400000),
          notes: '对手实力较弱，主要练习了新学的技术动作',
          tags: ['单打', '胜利', '技术练习'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 3 * 86400000)
        },
        {
          _id: 'match_5',
          type: 'doubles',
          players: {
            teamA: ['羽毛球爱好者', '小张'],
            teamB: ['高手A', '高手B']
          },
          score: {
            teamA: 18,
            teamB: 21
          },
          winner: 'teamB',
          duration: 58,
          venue: '专业训练馆',
          date: new Date(Date.now() - 4 * 86400000),
          notes: '遇到了高手，学到了很多新的战术和技巧',
          tags: ['双打', '失败', '学习经验'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 4 * 86400000)
        },
        {
          _id: 'match_6',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['小刘']
          },
          score: {
            teamA: 21,
            teamB: 19
          },
          winner: 'teamA',
          duration: 48,
          venue: '奥体中心羽毛球馆',
          date: new Date(Date.now() - 5 * 86400000),
          notes: '激烈的比赛，最后关键球险胜',
          tags: ['单打', '胜利', '激烈对战'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 5 * 86400000)
        },
        {
          _id: 'match_7',
          type: 'mixed',
          players: {
            teamA: ['羽毛球爱好者', '小美'],
            teamB: ['阿强', '小芳']
          },
          score: {
            teamA: 21,
            teamB: 16
          },
          winner: 'teamA',
          duration: 42,
          venue: '市体育馆',
          date: new Date(Date.now() - 6 * 86400000),
          notes: '今天发挥很稳定，各种技术都运用得当',
          tags: ['混双', '胜利', '发挥稳定'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 6 * 86400000)
        },
        {
          _id: 'match_8',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['新手小白']
          },
          score: {
            teamA: 21,
            teamB: 8
          },
          winner: 'teamA',
          duration: 25,
          venue: '社区活动中心',
          date: new Date(Date.now() - 7 * 86400000),
          notes: '指导新手，主要以练习为主',
          tags: ['单打', '胜利', '指导新手'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 7 * 86400000)
        },
        {
          _id: 'match_9',
          type: 'doubles',
          players: {
            teamA: ['羽毛球爱好者', '老搭档'],
            teamB: ['实力派A', '实力派B']
          },
          score: {
            teamA: 21,
            teamB: 23
          },
          winner: 'teamB',
          duration: 65,
          venue: '专业训练馆',
          date: new Date(Date.now() - 8 * 86400000),
          notes: '非常精彩的比赛，虽败犹荣',
          tags: ['双打', '失败', '精彩对战'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 8 * 86400000)
        },
        {
          _id: 'match_10',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['技术流']
          },
          score: {
            teamA: 21,
            teamB: 17
          },
          winner: 'teamA',
          duration: 44,
          venue: '大学体育馆',
          date: new Date(Date.now() - 9 * 86400000),
          notes: '对手技术很好，但我的体能优势明显',
          tags: ['单打', '胜利', '体能优势'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 9 * 86400000)
        },
        // 添加一些今天的比赛记录
        {
          _id: 'match_today_1',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['晨练伙伴']
          },
          score: {
            teamA: 21,
            teamB: 14
          },
          winner: 'teamA',
          duration: 32,
          venue: '奥体中心羽毛球馆',
          date: new Date(new Date().setHours(9, 30, 0, 0)),
          notes: '晨练状态很好，热身充分',
          tags: ['单打', '胜利', '晨练'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(new Date().setHours(9, 30, 0, 0))
        },
        {
          _id: 'match_today_2',
          type: 'doubles',
          players: {
            teamA: ['羽毛球爱好者', '黄金搭档'],
            teamB: ['挑战者1', '挑战者2']
          },
          score: {
            teamA: 21,
            teamB: 19
          },
          winner: 'teamA',
          duration: 46,
          venue: '奥体中心羽毛球馆',
          date: new Date(new Date().setHours(14, 15, 0, 0)),
          notes: '下午的比赛，配合越来越默契了',
          tags: ['双打', '胜利', '配合默契'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(new Date().setHours(14, 15, 0, 0))
        }
      ]

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 500))

      set({
        matches: mockMatches,
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '加载比赛记录失败'
      })
    }
  },

  saveMatch: async (matchData: Omit<Match, '_id' | 'createdAt'>) => {
    set({ loading: true, error: null })
    try {
      // 模拟保存比赛数据
      const newMatch: Match = {
        ...matchData,
        _id: `match_${Date.now()}`,
        createdAt: new Date()
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 500))

      get().addMatch(newMatch)
      set({ loading: false, error: null })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '保存比赛记录失败'
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))

interface StatisticsState {
  weeklyStats: any
  monthlyStats: any
  yearlyStats: any
  heatmapData: any[]
  loading: boolean
  error: string | null
  
  // Actions
  loadStatistics: (period: 'week' | 'month' | 'year') => Promise<void>
  loadHeatmapData: (year: number) => Promise<void>
  clearError: () => void
}

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  weeklyStats: null,
  monthlyStats: null,
  yearlyStats: null,
  heatmapData: [],
  loading: false,
  error: null,

  loadStatistics: async (period: 'week' | 'month' | 'year') => {
    set({ loading: true, error: null })
    try {
      // 模拟统计数据
      const mockStats = {
        totalMatches: 25,
        totalWins: 18,
        winRate: 0.72,
        averageDuration: 48,
        favoriteVenue: '体育馆A',
        bestPartner: '搭档A',
        improvement: 0.15,
        weeklyTrend: [3, 2, 4, 1, 3, 2, 5],
        monthlyData: {
          matches: [8, 12, 15, 10],
          wins: [6, 9, 11, 7]
        }
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 500))

      set({
        [`${period}lyStats`]: mockStats,
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '加载统计数据失败'
      })
    }
  },

  loadHeatmapData: async (year: number) => {
    set({ loading: true, error: null })
    try {
      // 模拟热力图数据
      const mockHeatmapData = []
      const startDate = new Date(year, 0, 1)
      const endDate = new Date(year, 11, 31)
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0
        mockHeatmapData.push({
          date: d.toISOString().split('T')[0],
          count: intensity,
          intensity: intensity
        })
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 500))

      set({
        heatmapData: mockHeatmapData,
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '加载热力图数据失败'
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))