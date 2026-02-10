import { create } from 'zustand'
import { User, Match, UserStats } from '@/types'

interface UserState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  updateUserStats: (stats: Partial<UserStats>) => void
  login: () => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,

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

  login: async () => {
    set({ loading: true, error: null })
    try {
      // 模拟登录 - 在Web环境下使用模拟数据
      const mockUser: User = {
        _id: 'mock_user_id',
        _openid: 'mock_openid',
        nickname: '羽毛球爱好者',
        avatarUrl: '/images/default-avatar.png',
        level: 3,
        stats: {
          totalMatches: 25,
          totalWins: 18,
          winRate: 0.72,
          currentStreak: 3,
          bestStreak: 8,
          weeklyGoal: 5,
          trends: {
            weeklyTrend: 0.15,
            monthlyTrend: 0.08,
            skillImprovement: 0.12
          }
        },
        equipment: [],
        settings: {
          privacy: 'public',
          notifications: {
            matchReminder: true,
            weeklyReport: true,
            achievements: true
          },
          theme: 'light'
        },
        createdAt: new Date(),
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
      // 模拟比赛数据
      const mockMatches: Match[] = [
        {
          _id: 'match_1',
          type: 'singles',
          players: {
            teamA: ['羽毛球爱好者'],
            teamB: ['对手A']
          },
          score: {
            teamA: 21,
            teamB: 18
          },
          winner: 'teamA',
          duration: 45,
          venue: '体育馆A',
          date: new Date(),
          notes: '今天状态不错',
          tags: ['单打', '胜利'],
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
            teamA: ['羽毛球爱好者', '搭档A'],
            teamB: ['对手B', '对手C']
          },
          score: {
            teamA: 19,
            teamB: 21
          },
          winner: 'teamB',
          duration: 52,
          venue: '体育馆B',
          date: new Date(Date.now() - 86400000),
          notes: '配合还需要加强',
          tags: ['双打', '失败'],
          media: {
            photos: [],
            videos: []
          },
          createdBy: 'mock_user_id',
          confirmedBy: [],
          createdAt: new Date(Date.now() - 86400000)
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