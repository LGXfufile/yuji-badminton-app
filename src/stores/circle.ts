import { create } from 'zustand'
import { Circle, CircleMembership } from '@/types/privacy'

// 圈子状态管理
interface CircleState {
  circles: Circle[]
  myCircles: Circle[]
  myMemberships: CircleMembership[]
  currentCircle: Circle | null
  loading: boolean
  error: string | null
  
  // Actions
  setCircles: (circles: Circle[]) => void
  addCircle: (circle: Circle) => void
  updateCircle: (circleId: string, updates: Partial<Circle>) => void
  deleteCircle: (circleId: string) => void
  setCurrentCircle: (circle: Circle | null) => void
  
  // Membership actions
  joinCircle: (circleId: string) => Promise<void>
  leaveCircle: (circleId: string) => Promise<void>
  updateMembership: (circleId: string, updates: Partial<CircleMembership>) => void
  
  // Data loading
  loadCircles: () => Promise<void>
  loadMyCircles: () => Promise<void>
  createCircle: (circleData: Omit<Circle, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'stats'>) => Promise<void>
  searchCircles: (query: string) => Promise<Circle[]>
  
  clearError: () => void
}

export const useCircleStore = create<CircleState>((set, get) => ({
  circles: [],
  myCircles: [],
  myMemberships: [],
  currentCircle: null,
  loading: false,
  error: null,

  setCircles: (circles: Circle[]) => {
    set({ circles, error: null })
  },

  addCircle: (circle: Circle) => {
    const { circles } = get()
    set({ circles: [circle, ...circles] })
  },

  updateCircle: (circleId: string, updates: Partial<Circle>) => {
    const { circles, myCircles } = get()
    const updateCircleInArray = (arr: Circle[]) =>
      arr.map(circle => circle.id === circleId ? { ...circle, ...updates } : circle)
    
    set({
      circles: updateCircleInArray(circles),
      myCircles: updateCircleInArray(myCircles)
    })
  },

  deleteCircle: (circleId: string) => {
    const { circles, myCircles, myMemberships } = get()
    set({
      circles: circles.filter(circle => circle.id !== circleId),
      myCircles: myCircles.filter(circle => circle.id !== circleId),
      myMemberships: myMemberships.filter(membership => membership.circleId !== circleId)
    })
  },

  setCurrentCircle: (circle: Circle | null) => {
    set({ currentCircle: circle })
  },

  joinCircle: async (circleId: string) => {
    set({ loading: true, error: null })
    try {
      const newMembership: CircleMembership = {
        circleId,
        userId: 'mock_user_id',
        role: 'member',
        status: 'active',
        joinedAt: new Date(),
        circleProfile: {
          nickname: '',
          bio: '',
          customAvatar: ''
        },
        permissions: {
          canInvite: false,
          canCreateEvents: false,
          canModerate: false
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      const { myMemberships, circles } = get()
      set({
        myMemberships: [...myMemberships, newMembership],
        loading: false,
        error: null
      })

      const circle = circles.find(c => c.id === circleId)
      if (circle) {
        get().updateCircle(circleId, { 
          memberCount: circle.memberCount + 1,
          stats: {
            ...circle.stats,
            activeMembers: circle.stats.activeMembers + 1
          }
        })
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '加入圈子失败'
      })
    }
  },

  leaveCircle: async (circleId: string) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const { myMemberships, circles } = get()
      set({
        myMemberships: myMemberships.filter(m => m.circleId !== circleId),
        loading: false,
        error: null
      })

      const circle = circles.find(c => c.id === circleId)
      if (circle) {
        get().updateCircle(circleId, { 
          memberCount: Math.max(0, circle.memberCount - 1),
          stats: {
            ...circle.stats,
            activeMembers: Math.max(0, circle.stats.activeMembers - 1)
          }
        })
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '退出圈子失败'
      })
    }
  },

  updateMembership: (circleId: string, updates: Partial<CircleMembership>) => {
    const { myMemberships } = get()
    const updatedMemberships = myMemberships.map(membership =>
      membership.circleId === circleId ? { ...membership, ...updates } : membership
    )
    set({ myMemberships: updatedMemberships })
  },

  loadCircles: async () => {
    set({ loading: true, error: null })
    try {
      const mockCircles: Circle[] = [
        {
          id: 'circle_1',
          name: '奥体中心羽毛球俱乐部',
          description: '专业的羽毛球训练和比赛，欢迎各个水平的球友加入',
          avatar: '🏢',
          type: 'club',
          privacy: 'public',
          memberCount: 156,
          maxMembers: 200,
          location: '奥体中心',
          tags: ['专业训练', '比赛', '技术提升'],
          createdBy: 'user_1',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date(),
          settings: {
            allowInvites: true,
            requireApproval: true,
            allowEvents: true,
            allowRanking: true
          },
          stats: {
            activeMembers: 89,
            totalMatches: 1234,
            eventsCount: 45,
            avgLevel: 6.2
          }
        },
        {
          id: 'circle_2',
          name: '周末羽毛球好友圈',
          description: '轻松愉快的周末羽毛球活动，重在参与和交流',
          avatar: '👥',
          type: 'friends',
          privacy: 'invite_only',
          memberCount: 23,
          maxMembers: 30,
          location: '市体育馆',
          tags: ['休闲', '周末', '好友'],
          createdBy: 'user_2',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date(),
          settings: {
            allowInvites: true,
            requireApproval: false,
            allowEvents: true,
            allowRanking: false
          },
          stats: {
            activeMembers: 18,
            totalMatches: 89,
            eventsCount: 12,
            avgLevel: 4.5
          }
        },
        {
          id: 'circle_3',
          name: '大学城羽毛球联盟',
          description: '大学生羽毛球爱好者的聚集地，青春活力无限',
          avatar: '🏫',
          type: 'school',
          privacy: 'approval_required',
          memberCount: 89,
          maxMembers: 100,
          location: '大学城体育中心',
          tags: ['学生', '青春', '活力'],
          createdBy: 'user_3',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date(),
          settings: {
            allowInvites: false,
            requireApproval: true,
            allowEvents: true,
            allowRanking: true
          },
          stats: {
            activeMembers: 67,
            totalMatches: 456,
            eventsCount: 23,
            avgLevel: 3.8
          }
        },
        {
          id: 'circle_4',
          name: '企业羽毛球联盟',
          description: '各大企业员工羽毛球交流平台，促进企业间友谊',
          avatar: '🏢',
          type: 'company',
          privacy: 'approval_required',
          memberCount: 234,
          maxMembers: 300,
          location: '商务区体育中心',
          tags: ['企业', '商务', '交流'],
          createdBy: 'user_4',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date(),
          settings: {
            allowInvites: true,
            requireApproval: true,
            allowEvents: true,
            allowRanking: true
          },
          stats: {
            activeMembers: 156,
            totalMatches: 2345,
            eventsCount: 78,
            avgLevel: 5.8
          }
        },
        {
          id: 'circle_5',
          name: '南山区羽毛球爱好者',
          description: '南山区本地羽毛球爱好者聚集地，就近约球更方便',
          avatar: '📍',
          type: 'location',
          privacy: 'public',
          memberCount: 67,
          maxMembers: 80,
          location: '南山区各大体育馆',
          tags: ['地区', '就近', '方便'],
          createdBy: 'user_5',
          createdAt: new Date('2024-02-05'),
          updatedAt: new Date(),
          settings: {
            allowInvites: true,
            requireApproval: false,
            allowEvents: true,
            allowRanking: true
          },
          stats: {
            activeMembers: 45,
            totalMatches: 234,
            eventsCount: 15,
            avgLevel: 4.2
          }
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 500))

      set({
        circles: mockCircles,
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '加载圈子列表失败'
      })
    }
  },

  loadMyCircles: async () => {
    set({ loading: true, error: null })
    try {
      const mockMyMemberships: CircleMembership[] = [
        {
          circleId: 'circle_2',
          userId: 'mock_user_id',
          role: 'member',
          status: 'active',
          joinedAt: new Date('2024-02-10'),
          circleProfile: {
            nickname: '羽球新手',
            bio: '刚开始学习羽毛球，请多指教',
            customAvatar: ''
          },
          permissions: {
            canInvite: true,
            canCreateEvents: false,
            canModerate: false
          }
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 500))

      const { circles } = get()
      const myCircles = circles.filter(circle => 
        mockMyMemberships.some(membership => membership.circleId === circle.id)
      )

      set({
        myMemberships: mockMyMemberships,
        myCircles,
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '加载我的圈子失败'
      })
    }
  },

  createCircle: async (circleData: Omit<Circle, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'stats'>) => {
    set({ loading: true, error: null })
    try {
      const newCircle: Circle = {
        ...circleData,
        id: `circle_${Date.now()}`,
        memberCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          activeMembers: 1,
          totalMatches: 0,
          eventsCount: 0,
          avgLevel: 1
        }
      }

      const ownerMembership: CircleMembership = {
        circleId: newCircle.id,
        userId: 'mock_user_id',
        role: 'owner',
        status: 'active',
        joinedAt: new Date(),
        circleProfile: {
          nickname: '',
          bio: '',
          customAvatar: ''
        },
        permissions: {
          canInvite: true,
          canCreateEvents: true,
          canModerate: true
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      const { circles, myCircles, myMemberships } = get()
      set({
        circles: [newCircle, ...circles],
        myCircles: [newCircle, ...myCircles],
        myMemberships: [ownerMembership, ...myMemberships],
        loading: false,
        error: null
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '创建圈子失败'
      })
    }
  },

  searchCircles: async (query: string) => {
    set({ loading: true, error: null })
    try {
      const { circles } = get()
      
      const results = circles.filter(circle => 
        circle.name.toLowerCase().includes(query.toLowerCase()) ||
        circle.description.toLowerCase().includes(query.toLowerCase()) ||
        circle.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        circle.location?.toLowerCase().includes(query.toLowerCase())
      )

      await new Promise(resolve => setTimeout(resolve, 300))

      set({ loading: false, error: null })
      return results
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || '搜索圈子失败'
      })
      return []
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))