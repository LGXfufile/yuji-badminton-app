'use client'

import React, { useState, useEffect } from 'react'
import { X, Trophy, Star, Target, Calendar, Zap, Users, Award } from 'lucide-react'
import { useUserStore, useMatchStore } from '@/stores'
import { ACHIEVEMENTS, checkAchievements, Achievement } from '@/types/achievements'

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AchievementModal({ isOpen, onClose }: AchievementModalProps) {
  const { user } = useUserStore()
  const { matches } = useMatchStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [newUnlocked, setNewUnlocked] = useState<Achievement[]>([])

  useEffect(() => {
    if (isOpen && matches.length > 0) {
      const updatedAchievements = [...ACHIEVEMENTS]
      const unlockedAchievements = checkAchievements(matches, user)
      
      // 更新成就状态
      unlockedAchievements.forEach(unlocked => {
        const index = updatedAchievements.findIndex(a => a.id === unlocked.id)
        if (index !== -1) {
          updatedAchievements[index] = unlocked
        }
      })
      
      setAchievements(updatedAchievements)
      setNewUnlocked(unlockedAchievements)
    }
  }, [isOpen, matches, user])

  if (!isOpen) return null

  const categories = [
    { id: 'all', label: '全部', icon: Trophy },
    { id: 'milestone', label: '里程碑', icon: Star },
    { id: 'skill', label: '技术', icon: Target },
    { id: 'frequency', label: '频率', icon: Calendar },
    { id: 'challenge', label: '挑战', icon: Zap },
    { id: 'social', label: '社交', icon: Users }
  ]

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward.points, 0)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-700'
      case 'rare': return 'text-blue-700'
      case 'epic': return 'text-purple-700'
      case 'legendary': return 'text-yellow-700'
      default: return 'text-gray-700'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">成就系统</h2>
              <p className="text-sm text-gray-600">已解锁 {unlockedCount}/{achievements.length} 个成就</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* 成就统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-700">{unlockedCount}</div>
                  <div className="text-sm text-yellow-600">已解锁成就</div>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">{totalPoints}</div>
                  <div className="text-sm text-blue-600">成就积分</div>
                </div>
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-2xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {Math.round((unlockedCount / achievements.length) * 100)}%
                  </div>
                  <div className="text-sm text-green-600">完成度</div>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* 新解锁成就提示 */}
          {newUnlocked.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border border-yellow-300">
              <div className="flex items-center space-x-3 mb-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">🎉 恭喜解锁新成就！</h3>
              </div>
              <div className="space-y-2">
                {newUnlocked.map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 text-yellow-700">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm opacity-80">{achievement.description}</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">+{achievement.reward.points} 积分</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              )
            })}
          </div>

          {/* 成就列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  achievement.unlocked 
                    ? getRarityColor(achievement.rarity)
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${
                        achievement.unlocked ? getRarityTextColor(achievement.rarity) : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {achievement.unlocked && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            已解锁
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                          achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                          achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {achievement.rarity === 'common' ? '普通' :
                           achievement.rarity === 'rare' ? '稀有' :
                           achievement.rarity === 'epic' ? '史诗' : '传说'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    
                    {/* 进度条 */}
                    {!achievement.unlocked && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>进度</span>
                          <span>{achievement.progress}/{achievement.condition.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((achievement.progress / achievement.condition.target) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* 奖励信息 */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600 font-medium">
                          +{achievement.reward.points} 积分
                        </span>
                        <span className="text-purple-600 font-medium">
                          {achievement.reward.badge}
                        </span>
                        {achievement.reward.title && (
                          <span className="text-orange-600 font-medium">
                            "{achievement.reward.title}"
                          </span>
                        )}
                      </div>
                      
                      {achievement.unlocked && achievement.unlockedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 激励文案 */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">继续努力，解锁更多成就！</h3>
              <p className="text-blue-700">
                每一次挥拍都是进步，每一个成就都是对你努力的认可。
                <br />
                坚持运动，享受羽毛球带来的快乐与成长！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}