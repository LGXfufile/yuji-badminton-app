'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity, 
  Calendar,
  Target,
  Zap,
  Eye,
  UserPlus,
  UserMinus,
  Clock,
  MapPin,
  Trophy,
  Share2,
  Heart,
  MessageCircle,
  Camera,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ComponentType<any>
  color: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'engagement'>('overview')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(false)

  // 核心指标数据
  const coreMetrics: MetricCard[] = [
    {
      title: '日活跃用户',
      value: '2,847',
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: '月活跃用户',
      value: '18,392',
      change: 8.3,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: '用户留存率',
      value: '73.2%',
      change: -2.1,
      changeType: 'decrease',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      title: '平均使用时长',
      value: '8.5分钟',
      change: 15.7,
      changeType: 'increase',
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  // 用户增长数据
  const userGrowthData: ChartData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    datasets: [
      {
        label: '新增用户',
        data: [1200, 1900, 3000, 5000, 4200, 3800, 4500],
        color: '#3B82F6'
      },
      {
        label: '活跃用户',
        data: [800, 1400, 2200, 3800, 3200, 2900, 3400],
        color: '#10B981'
      }
    ]
  }

  // 功能使用统计
  const featureUsageData = [
    { name: '比赛记录', usage: 89, color: '#3B82F6' },
    { name: '数据统计', usage: 76, color: '#10B981' },
    { name: '圈子功能', usage: 45, color: '#F59E0B' },
    { name: '分享功能', usage: 32, color: '#EF4444' },
    { name: '成就系统', usage: 28, color: '#8B5CF6' }
  ]

  // 地域分布数据
  const regionData = [
    { region: '北京', users: 3245, percentage: 18.2 },
    { region: '上海', users: 2891, percentage: 16.1 },
    { region: '广州', users: 2456, percentage: 13.7 },
    { region: '深圳', users: 2134, percentage: 11.9 },
    { region: '杭州', users: 1876, percentage: 10.5 },
    { region: '其他', users: 5290, percentage: 29.6 }
  ]

  // 内容质量指标
  const contentMetrics = [
    { metric: '比赛记录完整度', value: '85.3%', trend: 'up' },
    { metric: '照片上传率', value: '67.8%', trend: 'up' },
    { metric: '备注填写率', value: '42.1%', trend: 'down' },
    { metric: '数据准确性', value: '91.7%', trend: 'up' }
  ]

  // 用户行为热力图数据
  const heatmapData = [
    { hour: '6:00', activity: 15 },
    { hour: '7:00', activity: 45 },
    { hour: '8:00', activity: 78 },
    { hour: '9:00', activity: 92 },
    { hour: '10:00', activity: 85 },
    { hour: '11:00', activity: 67 },
    { hour: '12:00', activity: 45 },
    { hour: '13:00', activity: 32 },
    { hour: '14:00', activity: 28 },
    { hour: '15:00', activity: 35 },
    { hour: '16:00', activity: 52 },
    { hour: '17:00', activity: 78 },
    { hour: '18:00', activity: 95 },
    { hour: '19:00', activity: 100 },
    { hour: '20:00', activity: 88 },
    { hour: '21:00', activity: 65 },
    { hour: '22:00', activity: 42 },
    { hour: '23:00', activity: 25 }
  ]

  const refreshData = async () => {
    setLoading(true)
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">羽迹数据看板</h1>
                <p className="text-blue-100">实时监控小程序运营数据</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white backdrop-blur-sm"
                style={{ color: 'white' }}
              >
                <option value="7d" style={{ color: 'black' }}>近7天</option>
                <option value="30d" style={{ color: 'black' }}>近30天</option>
                <option value="90d" style={{ color: 'black' }}>近90天</option>
              </select>
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="flex space-x-2 mt-6">
            {[
              { key: 'overview', label: '总览', icon: BarChart3 },
              { key: 'users', label: '用户分析', icon: Users },
              { key: 'content', label: '内容分析', icon: Activity },
              { key: 'engagement', label: '互动分析', icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* 总览页面 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 核心指标卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreMetrics.map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className={`flex items-center space-x-1 text-sm font-medium ${
                          metric.changeType === 'increase' ? 'text-green-600' : 
                          metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <TrendingUp className={`w-4 h-4 ${
                            metric.changeType === 'decrease' ? 'rotate-180' : ''
                          }`} />
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.title}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 用户增长趋势图 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">用户增长趋势</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">新增用户</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">活跃用户</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 overflow-hidden">
                  <div className="h-full flex items-end justify-between space-x-2 px-2">
                    {userGrowthData.labels.map((label, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center space-y-2 max-w-[80px]">
                        <div className="w-full flex flex-col space-y-1 h-48">
                          <div 
                            className="bg-blue-500 rounded-t w-full"
                            style={{ 
                              height: `${Math.min((userGrowthData.datasets[0].data[index] / 5000) * 180, 180)}px`,
                              minHeight: '4px'
                            }}
                          ></div>
                          <div 
                            className="bg-green-500 rounded-b w-full"
                            style={{ 
                              height: `${Math.min((userGrowthData.datasets[1].data[index] / 5000) * 180, 180)}px`,
                              minHeight: '4px'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 text-center">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 功能使用统计和地域分布 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 功能使用统计 */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">功能使用统计</h3>
                  <div className="space-y-4">
                    {featureUsageData.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${feature.usage}%`,
                                backgroundColor: feature.color
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12">{feature.usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 地域分布 */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">用户地域分布</h3>
                  <div className="space-y-4">
                    {regionData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{region.region}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{region.users.toLocaleString()}</span>
                          <span className="text-sm font-medium text-gray-900">{region.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 用户分析页面 */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* 用户行为热力图 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">用户活跃时间分布</h3>
                <div className="grid grid-cols-6 md:grid-cols-12 lg:grid-cols-18 gap-2">
                  {heatmapData.map((data, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-8 h-8 rounded mb-2 flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${data.activity / 100})`,
                          color: data.activity > 50 ? 'white' : '#374151'
                        }}
                      >
                        {data.activity}
                      </div>
                      <div className="text-xs text-gray-600">{data.hour}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 用户留存分析 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">用户留存分析</h3>
                  <div className="space-y-4">
                    {[
                      { period: '次日留存', rate: 68.5, color: 'bg-blue-500' },
                      { period: '7日留存', rate: 45.2, color: 'bg-green-500' },
                      { period: '30日留存', rate: 28.7, color: 'bg-orange-500' }
                    ].map((retention, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{retention.period}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${retention.color}`}
                              style={{ width: `${retention.rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12">{retention.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">用户分层分析</h3>
                  <div className="space-y-4">
                    {[
                      { type: '新用户', count: 1247, percentage: 15.2, color: 'text-blue-600' },
                      { type: '活跃用户', count: 4892, percentage: 59.7, color: 'text-green-600' },
                      { type: '沉睡用户', count: 1653, percentage: 20.1, color: 'text-orange-600' },
                      { type: '流失用户', count: 408, percentage: 5.0, color: 'text-red-600' }
                    ].map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${segment.color.replace('text-', 'bg-')}`}></div>
                          <span className="text-sm font-medium text-gray-700">{segment.type}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{segment.count.toLocaleString()}</span>
                          <span className={`text-sm font-medium ${segment.color}`}>{segment.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 内容分析页面 */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* 内容质量指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contentMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      <div className={`p-2 rounded-xl ${
                        metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{metric.metric}</div>
                  </div>
                ))}
              </div>

              {/* 比赛记录分析 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">比赛记录分析</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">记录类型分布</h4>
                    {[
                      { type: '单打', count: 3245, color: 'bg-blue-500' },
                      { type: '双打', count: 2891, color: 'bg-green-500' },
                      { type: '混双', count: 1456, color: 'bg-purple-500' }
                    ].map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                          <span className="text-sm font-medium text-gray-700">{type.type}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{type.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">记录完整度</h4>
                    {[
                      { item: '基础信息', rate: 98.5 },
                      { item: '比分详情', rate: 87.3 },
                      { item: '比赛时长', rate: 76.8 },
                      { item: '场地信息', rate: 65.2 },
                      { item: '比赛备注', rate: 42.1 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.item}</span>
                        <span className="text-sm font-medium text-gray-900">{item.rate}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">媒体上传统计</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Camera className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">照片上传</div>
                          <div className="text-xs text-gray-600">67.8% 的记录包含照片</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">视频上传</div>
                          <div className="text-xs text-gray-600">23.4% 的记录包含视频</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 互动分析页面 */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              {/* 社交互动指标 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '分享次数', value: '12,847', icon: Share2, color: 'text-blue-600' },
                  { title: '点赞数量', value: '45,392', icon: Heart, color: 'text-red-600' },
                  { title: '评论数量', value: '8,756', icon: MessageCircle, color: 'text-green-600' }
                ].map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.title}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 圈子活跃度分析 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">圈子活跃度排行</h3>
                <div className="space-y-4">
                  {[
                    { name: '奥体中心羽毛球俱乐部', members: 156, activity: 95, growth: 12 },
                    { name: '周末羽毛球好友圈', members: 89, activity: 87, growth: 8 },
                    { name: '大学城羽毛球联盟', members: 134, activity: 82, growth: -3 },
                    { name: '专业羽毛球训练营', members: 67, activity: 78, growth: 15 },
                    { name: '业余羽毛球爱好者', members: 203, activity: 71, growth: 5 }
                  ].map((circle, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{circle.name}</div>
                          <div className="text-sm text-gray-600">{circle.members} 成员</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{circle.activity}%</div>
                          <div className="text-xs text-gray-600">活跃度</div>
                        </div>
                        <div className={`text-center ${
                          circle.growth > 0 ? 'text-green-600' : circle.growth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <div className="text-sm font-medium">{circle.growth > 0 ? '+' : ''}{circle.growth}%</div>
                          <div className="text-xs">增长率</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            最后更新: {new Date().toLocaleString('zh-CN')}
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>导出报告</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>高级筛选</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}