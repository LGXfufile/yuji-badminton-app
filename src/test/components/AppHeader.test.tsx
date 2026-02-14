import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppHeader from '@/components/HomePage/AppHeader'
import { User } from '@/types'

const mockUser: User = {
  _id: 'test-user',
  _openid: 'test-openid',
  nickname: '测试用户',
  avatarUrl: '/images/default-avatar.svg',
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

describe('AppHeader Component', () => {
  const mockProps = {
    user: mockUser,
    isAdmin: false,
    onProfileClick: jest.fn(),
    onRankingClick: jest.fn(),
    onAdminDashboardClick: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with user data', () => {
    render(<AppHeader {...mockProps} />)
    
    expect(screen.getByText('羽迹')).toBeInTheDocument()
    expect(screen.getByText('测试用户')).toBeInTheDocument()
    expect(screen.getByText('Lv.5 排行榜')).toBeInTheDocument()
  })

  it('shows admin dashboard button when user is admin', () => {
    render(<AppHeader {...mockProps} isAdmin={true} />)
    
    const adminButton = screen.getByTitle('管理员数据看板')
    expect(adminButton).toBeInTheDocument()
  })

  it('hides admin dashboard button when user is not admin', () => {
    render(<AppHeader {...mockProps} isAdmin={false} />)
    
    const adminButton = screen.queryByTitle('管理员数据看板')
    expect(adminButton).not.toBeInTheDocument()
  })

  it('calls onProfileClick when avatar is clicked', async () => {
    const user = userEvent.setup()
    render(<AppHeader {...mockProps} />)
    
    const avatar = screen.getByAltText('头像')
    await user.click(avatar)
    
    expect(mockProps.onProfileClick).toHaveBeenCalledTimes(1)
  })

  it('calls onRankingClick when ranking button is clicked', async () => {
    const user = userEvent.setup()
    render(<AppHeader {...mockProps} />)
    
    const rankingButton = screen.getByText('Lv.5 排行榜')
    await user.click(rankingButton)
    
    expect(mockProps.onRankingClick).toHaveBeenCalledTimes(1)
  })

  it('calls onAdminDashboardClick when admin button is clicked', async () => {
    const user = userEvent.setup()
    render(<AppHeader {...mockProps} isAdmin={true} />)
    
    const adminButton = screen.getByTitle('管理员数据看板')
    await user.click(adminButton)
    
    expect(mockProps.onAdminDashboardClick).toHaveBeenCalledTimes(1)
  })

  it('displays correct user level', () => {
    const userWithDifferentLevel = { ...mockUser, level: 8 }
    render(<AppHeader {...mockProps} user={userWithDifferentLevel} />)
    
    expect(screen.getByText('Lv.8 排行榜')).toBeInTheDocument()
  })

  it('handles missing user gracefully', () => {
    render(<AppHeader {...mockProps} user={null} />)
    
    expect(screen.getByText('羽迹')).toBeInTheDocument()
    // Should still render without crashing
  })
})