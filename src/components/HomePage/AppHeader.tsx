'use client'

import React from 'react'
import { Trophy, BarChart3 } from 'lucide-react'
import { User } from '@/types'

interface AppHeaderProps {
  user: User | null
  isAdmin: boolean
  onProfileClick: () => void
  onRankingClick: () => void
  onAdminDashboardClick: () => void
}

export default function AppHeader({ 
  user, 
  isAdmin, 
  onProfileClick, 
  onRankingClick, 
  onAdminDashboardClick 
}: AppHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">羽迹</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <img 
              src={user?.avatarUrl || '/images/default-avatar.svg'}
              alt="头像"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
              onClick={onProfileClick}
            />
            <span className="text-gray-700 font-medium">{user?.nickname}</span>
            <button
              onClick={onRankingClick}
              className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
            >
              Lv.{user?.level} 排行榜
            </button>
            {isAdmin && (
              <button
                onClick={onAdminDashboardClick}
                className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all"
                title="管理员数据看板"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}