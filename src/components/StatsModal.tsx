'use client'

import React, { useEffect, useState } from 'react'
import { X, TrendingUp, Calendar, Trophy, Target, BarChart3 } from 'lucide-react'
import { useStatisticsStore, useMatchStore } from '@/stores'

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { weeklyStats, monthlyStats, loadStatistics, loading } = useStatisticsStore()
  const { matches } = useMatchStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    if (isOpen) {
      loadStatistics(selectedPeriod)
    }
  }, [isOpen, selectedPeriod, loadStatistics])

  if (!isOpen) return null

  const stats = selectedPeriod === 'week' ? weeklyStats : monthlyStats

  // 计算实时统计数据
  const totalMatches = matches.length
  const wins = matches.filter(m => m.winner === 'teamA').length
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0
  const avgDuration = totalMatches > 0 ? matches.reduce((sum, m) => sum + m.duration, 0) / totalMatches : 0

  // 按类型统计
  const matchesByType = {
    singles: matches.filter(m => m.type === 'singles').length,
    doubles: matches.filter(m => m.type === 'doubles').length,
    mixed: matches.filter(m => m.type === 'mixed').length
  }

  // 最近7天的比赛数据
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayMatches = matches.filter(m => {
      const matchDate = new Date(m.date)
      return matchDate.toDateString() === date.toDateString()
    })
    return {
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      matches: dayMatches.length,
      wins: dayMatches.filter(m => m.winner === 'teamA').length
    }
  }).reverse()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">数据统计</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* 时间段选择 */}
          <div className="flex space-x-2 mb-6">
            {[
              { value: 'week', label: '本周' },
              { value: 'month', label: '本月' },
              { value: 'year', label: '本年' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as any)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 核心数据卡片 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">{totalMatches}</div>
                  <div className="text-sm text-blue-700">总比赛场次</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">{winRate.toFixed(1)}%</div>
                  <div className="text-sm text-green-700">胜率</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">{wins}</div>
                  <div className="text-sm text-purple-700">胜场数</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900 mb-1">{avgDuration.toFixed(0)}</div>
                  <div className="text-sm text-orange-700">平均时长(分钟)</div>
                </div>
              </div>

              {/* 比赛类型分布 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  比赛类型分布
                </h3>
                <div className="space-y-3">
                  {[
                    { type: 'singles', label: '单打', count: matchesByType.singles, color: 'bg-blue-500' },
                    { type: 'doubles', label: '双打', count: matchesByType.doubles, color: 'bg-green-500' },
                    { type: 'mixed', label: '混双', count: matchesByType.mixed, color: 'bg-purple-500' }
                  ].map((item) => (
                    <div key={item.type} className="flex items-center">
                      <div className="w-20 text-sm text-gray-600">{item.label}</div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div
                            className={`${item.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${totalMatches > 0 ? (item.count / totalMatches) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 最近7天趋势 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  最近7天趋势
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {last7Days.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="text-lg font-bold text-gray-900">{day.matches}</div>
                        <div className="text-xs text-gray-500">场次</div>
                        {day.matches > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            胜 {day.wins}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 详细统计 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">比赛表现</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">连胜记录</span>
                      <span className="font-medium">3 场</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">最长比赛</span>
                      <span className="font-medium">{Math.max(...matches.map(m => m.duration), 0)} 分钟</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">最短比赛</span>
                      <span className="font-medium">{Math.min(...matches.map(m => m.duration), 0)} 分钟</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">常用场地</span>
                      <span className="font-medium">体育馆A</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">技术分析</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">技术提升</span>
                      <span className="font-medium text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">稳定性</span>
                      <span className="font-medium text-blue-600">良好</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">优势项目</span>
                      <span className="font-medium">单打</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">需要改进</span>
                      <span className="font-medium text-orange-600">双打配合</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}