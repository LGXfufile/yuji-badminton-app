import { renderHook, act } from '@testing-library/react'
import { useUserStore } from '@/stores'

// Mock the dependencies
jest.mock('@/types/privacy', () => ({
  DEFAULT_PRIVACY_SETTINGS: {
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
  },
  checkPrivacyAccess: jest.fn(() => true)
}))

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      isLoggedIn: false,
      loading: false,
      error: null,
      privacySettings: {
        globalLevel: 'public' as any,
        modules: {
          profile: 'public' as any,
          matches: 'public' as any,
          statistics: 'public' as any,
          achievements: 'public' as any,
          ranking: 'public' as any,
          equipment: 'circle' as any,
          social: 'private' as any
        },
        advanced: {
          allowFriendRequests: true,
          showOnlineStatus: true,
          allowDataExport: true,
          searchable: true
        }
      }
    })
  })

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useUserStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets user correctly', () => {
    const { result } = renderHook(() => useUserStore())
    
    const mockUser = {
      _id: 'test-user',
      _openid: 'test-openid',
      nickname: '测试用户',
      avatarUrl: '/test-avatar.jpg',
      level: 5,
      stats: {
        totalMatches: 10,
        totalWins: 7,
        winRate: 0.7,
        currentStreak: 3,
        bestStreak: 5,
        weeklyGoal: 4,
        trends: {
          weeklyTrend: 0.1,
          monthlyTrend: 0.15,
          skillImprovement: 0.2
        }
      },
      equipment: [],
      settings: {
        privacy: 'public' as any,
        notifications: {
          matchReminder: true,
          weeklyReport: true,
          achievements: true
        },
        theme: 'light' as any
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    act(() => {
      result.current.setUser(mockUser)
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('updates user stats correctly', () => {
    const { result } = renderHook(() => useUserStore())
    
    const mockUser = {
      _id: 'test-user',
      _openid: 'test-openid',
      nickname: '测试用户',
      avatarUrl: '/test-avatar.jpg',
      level: 5,
      stats: {
        totalMatches: 10,
        totalWins: 7,
        winRate: 0.7,
        currentStreak: 3,
        bestStreak: 5,
        weeklyGoal: 4,
        trends: {
          weeklyTrend: 0.1,
          monthlyTrend: 0.15,
          skillImprovement: 0.2
        }
      },
      equipment: [],
      settings: {
        privacy: 'public' as any,
        notifications: {
          matchReminder: true,
          weeklyReport: true,
          achievements: true
        },
        theme: 'light' as any
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    act(() => {
      result.current.setUser(mockUser)
    })
    
    const newStats = {
      totalMatches: 15,
      winRate: 0.8
    }
    
    act(() => {
      result.current.updateUserStats(newStats)
    })
    
    expect(result.current.user?.stats.totalMatches).toBe(15)
    expect(result.current.user?.stats.winRate).toBe(0.8)
    expect(result.current.user?.stats.currentStreak).toBe(3) // Should preserve other stats
  })

  it('handles login process correctly', async () => {
    const { result } = renderHook(() => useUserStore())
    
    let loginPromise: Promise<void>
    
    act(() => {
      loginPromise = result.current.login()
    })
    
    // Should set loading to true immediately
    expect(result.current.loading).toBe(true)
    
    // Wait for login to complete
    await act(async () => {
      await loginPromise
    })
    
    expect(result.current.loading).toBe(false)
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.user).toBeTruthy()
    expect(result.current.user?.nickname).toBe('羽毛球达人')
  })

  it('handles logout correctly', () => {
    const { result } = renderHook(() => useUserStore())
    
    // First login
    act(() => {
      result.current.setUser({
        _id: 'test-user',
        _openid: 'test-openid',
        nickname: '测试用户',
        avatarUrl: '/test-avatar.jpg',
        level: 5,
        stats: {
          totalMatches: 10,
          totalWins: 7,
          winRate: 0.7,
          currentStreak: 3,
          bestStreak: 5,
          weeklyGoal: 4,
          trends: {
            weeklyTrend: 0.1,
            monthlyTrend: 0.15,
            skillImprovement: 0.2
          }
        },
        equipment: [],
        settings: {
          privacy: 'public' as any,
          notifications: {
            matchReminder: true,
            weeklyReport: true,
            achievements: true
          },
          theme: 'light' as any
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })
    
    expect(result.current.isLoggedIn).toBe(true)
    
    // Then logout
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('clears error correctly', () => {
    const { result } = renderHook(() => useUserStore())
    
    // Set an error state
    act(() => {
      useUserStore.setState({ error: 'Test error' })
    })
    
    expect(result.current.error).toBe('Test error')
    
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('checks privacy access correctly', () => {
    const { result } = renderHook(() => useUserStore())
    
    const canView = result.current.canViewUserData('profile', {
      isOwner: true,
      isInSameCircle: false,
      isPublicViewer: false
    })
    
    expect(canView).toBe(true)
  })
})