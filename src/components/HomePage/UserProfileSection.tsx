'use client'

import React from 'react'
import { Target } from 'lucide-react'
import { User } from '@/types'

interface UserProfileSectionProps {
  user: User | null
  onProfileClick: () => void
  onAchievementClick: () => void
}

export default function UserProfileSection({ 
  user, 
  onProfileClick, 
  onAchievementClick 
}: UserProfileSectionProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
        <div className="flex flex-col items-center lg:items-start">
          <img 
            src={user?.avatarUrl || '/images/default-avatar.svg'}
            alt="头像"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={onProfileClick}
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.nickname}</h2>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center text-blue-600 font-medium">
              <Target className="w-4 h-4 mr-1" />
              技术等级: Lv.{user?.level || 1}
            </div>
            <button
              onClick={onAchievementClick}
              className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium hover:shadow-lg transition-all"
            >
              🏆 成就
            </button>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-200/30">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {user?.stats?.totalMatches || 0}
            </div>
            <div className="text-gray-600 font-medium">总场次</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-200/30">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {((user?.stats?.winRate || 0) * 100).toFixed(1)}%
            </div>
            <div className="text-gray-600 font-medium">胜率</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-200/30">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {user?.stats?.currentStreak || 0}
            </div>
            <div className="text-gray-600 font-medium">连胜</div>
          </div>
        </div>
      </div>
    </div>
  )
}