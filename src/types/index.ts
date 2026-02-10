// 用户相关类型定义
export interface User {
  _id: string;
  _openid: string;
  nickname: string;
  avatarUrl: string;
  level: number;
  stats: UserStats;
  equipment: UserEquipment[];
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalMatches: number;
  totalWins: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  weeklyGoal: number;
  trends: {
    weeklyTrend: number;
    monthlyTrend: number;
    skillImprovement: number;
  };
}

export interface UserEquipment {
  id: string;
  type: 'racket' | 'shoes' | 'clothing';
  brand: string;
  model: string;
  purchaseDate: Date;
  usageCount: number;
}

export interface UserSettings {
  privacy: 'public' | 'private';
  notifications: {
    matchReminder: boolean;
    weeklyReport: boolean;
    achievements: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

// 比赛相关类型定义
export interface Match {
  _id: string;
  type: 'singles' | 'doubles' | 'mixed';
  players: {
    teamA: string[];
    teamB: string[];
  };
  score: {
    teamA: number;
    teamB: number;
  };
  winner: 'teamA' | 'teamB';
  duration: number;
  venue: string;
  date: Date;
  notes: string;
  tags: string[];
  media: {
    photos: string[];
    videos: string[];
  };
  createdBy: string;
  confirmedBy: string[];
  createdAt: Date;
}

// 统计相关类型定义
export interface StatisticsSnapshot {
  _id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  data: {
    frequency: {
      daily: boolean;
      weeklyCount: number;
      monthlyCount: number;
      yearlyCount: number;
    };
    winLoss: {
      total: number;
      wins: number;
      losses: number;
      winRate: number;
    };
    partners: Array<{
      userId: string;
      matches: number;
      wins: number;
      winRate: number;
    }>;
    timeDistribution: {
      morning: number;
      afternoon: number;
      evening: number;
    };
  };
  createdAt: Date;
}

// 热力图数据类型
export interface HeatmapData {
  date: string;
  count: number;
  intensity: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 页面状态类型
export interface PageState {
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

// 表单验证类型
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// 组件 Props 类型
export interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}