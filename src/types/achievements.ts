export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'frequency' | 'skill' | 'social' | 'milestone' | 'challenge'
  condition: {
    type: 'matches_count' | 'win_streak' | 'win_rate' | 'duration' | 'frequency' | 'improvement' | 'social'
    target: number
    period?: 'day' | 'week' | 'month' | 'year' | 'all_time'
  }
  reward: {
    points: number
    badge: string
    title?: string
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  unlockedAt?: Date
  progress: number
}

// 成就系统配置
export const ACHIEVEMENTS: Achievement[] = [
  // 🏆 里程碑成就 - 激励长期参与
  {
    id: 'first_match',
    title: '初出茅庐',
    description: '完成第一场比赛',
    icon: '🏸',
    category: 'milestone',
    condition: { type: 'matches_count', target: 1, period: 'all_time' },
    reward: { points: 50, badge: '新手', title: '羽球新人' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },
  {
    id: 'matches_10',
    title: '小有所成',
    description: '累计完成10场比赛',
    icon: '🎯',
    category: 'milestone',
    condition: { type: 'matches_count', target: 10, period: 'all_time' },
    reward: { points: 100, badge: '进步者', title: '羽球爱好者' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },
  {
    id: 'matches_50',
    title: '经验丰富',
    description: '累计完成50场比赛',
    icon: '🏅',
    category: 'milestone',
    condition: { type: 'matches_count', target: 50, period: 'all_time' },
    reward: { points: 300, badge: '老手', title: '羽球达人' },
    rarity: 'rare',
    unlocked: false,
    progress: 0
  },
  {
    id: 'matches_100',
    title: '百战老将',
    description: '累计完成100场比赛',
    icon: '👑',
    category: 'milestone',
    condition: { type: 'matches_count', target: 100, period: 'all_time' },
    reward: { points: 500, badge: '百战老将', title: '羽球专家' },
    rarity: 'epic',
    unlocked: false,
    progress: 0
  },

  // 🔥 连胜成就 - 激励技术提升
  {
    id: 'win_streak_3',
    title: '连胜达人',
    description: '获得3连胜',
    icon: '🔥',
    category: 'skill',
    condition: { type: 'win_streak', target: 3 },
    reward: { points: 80, badge: '连胜者' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },
  {
    id: 'win_streak_5',
    title: '势不可挡',
    description: '获得5连胜',
    icon: '⚡',
    category: 'skill',
    condition: { type: 'win_streak', target: 5 },
    reward: { points: 150, badge: '连胜王' },
    rarity: 'rare',
    unlocked: false,
    progress: 0
  },
  {
    id: 'win_streak_10',
    title: '无敌战神',
    description: '获得10连胜',
    icon: '🌟',
    category: 'skill',
    condition: { type: 'win_streak', target: 10 },
    reward: { points: 400, badge: '战神', title: '不败传说' },
    rarity: 'legendary',
    unlocked: false,
    progress: 0
  },

  // 📈 胜率成就 - 激励技术稳定性
  {
    id: 'win_rate_70',
    title: '技术稳定',
    description: '胜率达到70%（至少10场比赛）',
    icon: '📊',
    category: 'skill',
    condition: { type: 'win_rate', target: 70 },
    reward: { points: 120, badge: '稳定发挥' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },
  {
    id: 'win_rate_80',
    title: '高手风范',
    description: '胜率达到80%（至少20场比赛）',
    icon: '🎖️',
    category: 'skill',
    condition: { type: 'win_rate', target: 80 },
    reward: { points: 250, badge: '高手', title: '技术大师' },
    rarity: 'rare',
    unlocked: false,
    progress: 0
  },

  // ⏰ 频率成就 - 激励运动习惯
  {
    id: 'daily_player',
    title: '每日一战',
    description: '连续7天每天至少打1场比赛',
    icon: '📅',
    category: 'frequency',
    condition: { type: 'frequency', target: 7, period: 'day' },
    reward: { points: 200, badge: '每日战士' },
    rarity: 'rare',
    unlocked: false,
    progress: 0
  },
  {
    id: 'weekly_warrior',
    title: '周末战士',
    description: '单周完成5场比赛',
    icon: '🗓️',
    category: 'frequency',
    condition: { type: 'matches_count', target: 5, period: 'week' },
    reward: { points: 100, badge: '周末战士' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },
  {
    id: 'monthly_champion',
    title: '月度冠军',
    description: '单月完成20场比赛',
    icon: '🏆',
    category: 'frequency',
    condition: { type: 'matches_count', target: 20, period: 'month' },
    reward: { points: 300, badge: '月度冠军', title: '运动达人' },
    rarity: 'epic',
    unlocked: false,
    progress: 0
  },

  // ⏱️ 耐力成就 - 激励体能提升
  {
    id: 'marathon_match',
    title: '马拉松战士',
    description: '单场比赛时长超过60分钟',
    icon: '⏱️',
    category: 'challenge',
    condition: { type: 'duration', target: 60 },
    reward: { points: 150, badge: '耐力王' },
    rarity: 'rare',
    unlocked: false,
    progress: 0
  },
  {
    id: 'speed_demon',
    title: '闪电战',
    description: '单场比赛在20分钟内获胜',
    icon: '⚡',
    category: 'challenge',
    condition: { type: 'duration', target: 20 },
    reward: { points: 100, badge: '速战速决' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },

  // 🎯 技术成就 - 激励全面发展
  {
    id: 'all_rounder',
    title: '全能选手',
    description: '单打、双打、混双各胜利1场',
    icon: '🎯',
    category: 'skill',
    condition: { type: 'improvement', target: 3 },
    reward: { points: 200, badge: '全能王', title: '全面发展' },
    rarity: 'rare',
    unlocked: false,
    progress: 0
  },
  {
    id: 'singles_master',
    title: '单打王者',
    description: '单打胜率达到85%（至少10场）',
    icon: '👤',
    category: 'skill',
    condition: { type: 'win_rate', target: 85 },
    reward: { points: 250, badge: '单打王' },
    rarity: 'epic',
    unlocked: false,
    progress: 0
  },
  {
    id: 'doubles_master',
    title: '双打专家',
    description: '双打胜率达到85%（至少10场）',
    icon: '👥',
    category: 'skill',
    condition: { type: 'win_rate', target: 85 },
    reward: { points: 250, badge: '双打王' },
    rarity: 'epic',
    unlocked: false,
    progress: 0
  },

  // 🌟 特殊成就 - 激励社交互动
  {
    id: 'comeback_king',
    title: '逆转王',
    description: '在落后10分的情况下获胜',
    icon: '🔄',
    category: 'challenge',
    condition: { type: 'improvement', target: 1 },
    reward: { points: 300, badge: '逆转王', title: '永不放弃' },
    rarity: 'epic',
    unlocked: false,
    progress: 0
  },
  {
    id: 'perfect_game',
    title: '完美比赛',
    description: '以21:0的比分获胜',
    icon: '💎',
    category: 'challenge',
    condition: { type: 'improvement', target: 1 },
    reward: { points: 500, badge: '完美主义者', title: '完美战士' },
    rarity: 'legendary',
    unlocked: false,
    progress: 0
  },

  // 📱 应用使用成就 - 激励功能使用
  {
    id: 'goal_setter',
    title: '目标导向',
    description: '设置第一个个人目标',
    icon: '🎯',
    category: 'social',
    condition: { type: 'social', target: 1 },
    reward: { points: 50, badge: '规划师' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  },
  {
    id: 'social_sharer',
    title: '分享达人',
    description: '分享5次比赛结果',
    icon: '📤',
    category: 'social',
    condition: { type: 'social', target: 5 },
    reward: { points: 100, badge: '分享王' },
    rarity: 'common',
    unlocked: false,
    progress: 0
  }
]

// 成就检查函数
export const checkAchievements = (matches: Match[], user: any): Achievement[] => {
  const unlockedAchievements: Achievement[] = []
  
  ACHIEVEMENTS.forEach(achievement => {
    if (achievement.unlocked) return
    
    let progress = 0
    let unlocked = false
    
    switch (achievement.condition.type) {
      case 'matches_count':
        if (achievement.condition.period === 'all_time') {
          progress = matches.length
        } else if (achievement.condition.period === 'week') {
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          progress = matches.filter(m => new Date(m.date) >= weekAgo).length
        } else if (achievement.condition.period === 'month') {
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          progress = matches.filter(m => new Date(m.date) >= monthAgo).length
        }
        unlocked = progress >= achievement.condition.target
        break
        
      case 'win_streak':
        progress = user?.stats?.currentStreak || 0
        unlocked = progress >= achievement.condition.target
        break
        
      case 'win_rate':
        if (matches.length >= 10) {
          const winRate = (matches.filter(m => m.winner === 'teamA').length / matches.length) * 100
          progress = Math.round(winRate)
          unlocked = progress >= achievement.condition.target
        }
        break
    }
    
    achievement.progress = Math.min(progress, achievement.condition.target)
    
    if (unlocked && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date()
      unlockedAchievements.push(achievement)
    }
  })
  
  return unlockedAchievements
}