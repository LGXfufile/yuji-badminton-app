import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuickActionsGrid from '@/components/HomePage/QuickActionsGrid'

describe('QuickActionsGrid Component', () => {
  const mockActions = [
    {
      icon: '🏸',
      text: '记录比赛',
      color: 'from-blue-500 to-blue-600',
      onClick: jest.fn()
    },
    {
      icon: '📊',
      text: '查看数据',
      color: 'from-green-500 to-green-600',
      onClick: jest.fn()
    },
    {
      icon: '👥',
      text: '圈子管理',
      color: 'from-purple-500 to-purple-600',
      onClick: jest.fn()
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all actions correctly', () => {
    render(<QuickActionsGrid actions={mockActions} />)
    
    expect(screen.getByText('快捷操作')).toBeInTheDocument()
    expect(screen.getByText('记录比赛')).toBeInTheDocument()
    expect(screen.getByText('查看数据')).toBeInTheDocument()
    expect(screen.getByText('圈子管理')).toBeInTheDocument()
  })

  it('displays action icons correctly', () => {
    render(<QuickActionsGrid actions={mockActions} />)
    
    expect(screen.getByText('🏸')).toBeInTheDocument()
    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('👥')).toBeInTheDocument()
  })

  it('calls onClick when action button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuickActionsGrid actions={mockActions} />)
    
    const recordButton = screen.getByText('记录比赛').closest('button')
    await user.click(recordButton!)
    
    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1)
  })

  it('handles empty actions array', () => {
    render(<QuickActionsGrid actions={[]} />)
    
    expect(screen.getByText('快捷操作')).toBeInTheDocument()
    // Should render without crashing
  })

  it('applies correct CSS classes for colors', () => {
    render(<QuickActionsGrid actions={mockActions} />)
    
    const recordButton = screen.getByText('记录比赛').closest('button')
    expect(recordButton).toHaveClass('from-blue-500', 'to-blue-600')
  })
})