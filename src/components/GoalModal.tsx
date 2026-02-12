'use client'

import React, { useState } from 'react'
import { X, Target, Calendar, Trophy, TrendingUp } from 'lucide-react'
import { useUserStore } from '@/stores'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GoalModal({ isOpen, onClose }: GoalModalProps) {
  const { user, updateUserStats } = useUserStore()
  
  const [goals, setGoals] = useState({
    weeklyMatches: user?.stats?.weeklyGoal || 5,
    targetWinRate: 75,
    skillImprovement: 'consistency',
    monthlyTarget: 20,
    yearlyTarget: 200
  })

  const [customGoal, setCustomGoal] = useState('')
  const [customGoals, setCustomGoals] = useState([
    '提高发球准确性',
    '加强网前技术',
    '增强体能耐力'
  ])

  const handleSaveGoals = () => {
    updateUserStats({
      weeklyGoal: goals.weeklyMatches
    })
    
    // 这里可以保存到本地存储或发送到服务器
    localStorage.setItem('badmintonGoals', JSON.stringify(goals))
    localStorage.setItem('customGoals', JSON.stringify(customGoals))
    
    alert('目标设置已保存！')
    onClose()
  }

  const addCustomGoal = () => {
    if (customGoal.trim() && !customGoals.includes(customGoal.trim())) {
      setCustomGoals([...customGoals, customGoal.trim()])
      setCustomGoal('')
    }
  }

  const removeCustomGoal = (goal: string) => {
    setCustomGoals(customGoals.filter(g => g !== goal))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">设置目标</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 当前进度概览 */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-blue-600" />
              当前进度
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user?.stats?.totalMatches || 0}</div>
                <div className="text-sm text-gray-600">总比赛场次</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {((user?.stats?.winRate || 0) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">当前胜率</div>
              </div>
            </div>
          </div>

          {/* 比赛频率目标 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              比赛频率目标
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">每周目标</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={goals.weeklyMatches}
                    onChange={(e) => setGoals(prev => ({ ...prev, weeklyMatches: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="20"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">场</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">每月目标</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={goals.monthlyTarget}
                    onChange={(e) => setGoals(prev => ({ ...prev, monthlyTarget: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="100"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">场</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">年度目标</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={goals.yearlyTarget}
                    onChange={(e) => setGoals(prev => ({ ...prev, yearlyTarget: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="500"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">场</span>
                </div>
              </div>
            </div>
          </div>

          {/* 胜率目标 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              胜率目标
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">目标胜率</label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={goals.targetWinRate}
                  onChange={(e) => setGoals(prev => ({ ...prev, targetWinRate: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>50%</span>
                  <span className="font-medium text-lg text-blue-600">{goals.targetWinRate}%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 技术提升重点 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              技术提升重点
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'consistency', label: '稳定性' },
                { value: 'power', label: '力量' },
                { value: 'speed', label: '速度' },
                { value: 'technique', label: '技巧' },
                { value: 'strategy', label: '战术' },
                { value: 'fitness', label: '体能' }
              ].map((skill) => (
                <button
                  key={skill.value}
                  onClick={() => setGoals(prev => ({ ...prev, skillImprovement: skill.value }))}
                  className={`p-3 rounded-xl border-2 font-medium transition-all ${
                    goals.skillImprovement === skill.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>

          {/* 自定义目标 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">个人目标</h3>
            
            <div className="space-y-3">
              {customGoals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">{goal}</span>
                  <button
                    onClick={() => removeCustomGoal(goal)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="添加个人目标..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
              />
              <button
                onClick={addCustomGoal}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                添加
              </button>
            </div>
          </div>

          {/* 目标提醒设置 */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">目标提醒</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" defaultChecked />
                <span className="text-sm text-yellow-700">每周进度提醒</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" defaultChecked />
                <span className="text-sm text-yellow-700">目标达成庆祝</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
                <span className="text-sm text-yellow-700">技术建议推送</span>
              </label>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSaveGoals}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg font-medium"
            >
              保存目标
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}