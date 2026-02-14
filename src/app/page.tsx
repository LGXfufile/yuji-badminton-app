'use client'

import React, { useEffect, useState } from 'react'
import { useUserStore, useMatchStore, useCircleStore } from '@/stores'
import { Trophy } from 'lucide-react'
import AppHeader from '@/components/HomePage/AppHeader'
import UserProfileSection from '@/components/HomePage/UserProfileSection'
import TodayStatsSection from '@/components/HomePage/TodayStatsSection'
import CircleSection from '@/components/HomePage/CircleSection'
import QuickActionsGrid from '@/components/HomePage/QuickActionsGrid'
import RecentMatchesList from '@/components/HomePage/RecentMatchesList'
import ModalManager from '@/components/HomePage/ModalManager'

export default function HomePage() {
  const { user, isLoggedIn, login, loading } = useUserStore()
  const { matches, loadMatches } = useMatchStore()
  const { myCircles, loadCircles, loadMyCircles } = useCircleStore()
  
  // 模态框状态
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const [statsModalOpen, setStatsModalOpen] = useState(false)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [rankingModalOpen, setRankingModalOpen] = useState(false)
  const [achievementModalOpen, setAchievementModalOpen] = useState(false)
  const [circleModalOpen, setCircleModalOpen] = useState(false)
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      loadMatches()
      loadCircles()
      loadMyCircles()
    }
  }, [isLoggedIn, loadMatches, loadCircles, loadMyCircles])

  const handleLogin = async () => {
    await login()
  }

  // 检查是否为管理员
  const isAdmin = true

  // 计算今日比赛和最近比赛
  const todayMatches = matches.filter(match => {
    const today = new Date()
    const matchDate = new Date(match.date)
    return matchDate.toDateString() === today.toDateString()
  })

  const recentMatches = matches.slice(0, 3)

  // 快捷操作配置
  const quickActions = [
    { 
      icon: '🏸', 
      text: '记录比赛', 
      color: 'from-blue-500 to-blue-600', 
      onClick: () => setRecordModalOpen(true) 
    },
    { 
      icon: '📊', 
      text: '查看数据', 
      color: 'from-green-500 to-green-600', 
      onClick: () => setStatsModalOpen(true) 
    },
    { 
      icon: '👥', 
      text: '圈子管理', 
      color: 'from-purple-500 to-purple-600', 
      onClick: () => setCircleModalOpen(true) 
    },
    { 
      icon: '🎯', 
      text: '设置目标', 
      color: 'from-orange-500 to-orange-600', 
      onClick: () => setGoalModalOpen(true) 
    },
    { 
      icon: '📷', 
      text: '分享战绩', 
      color: 'from-pink-500 to-pink-600', 
      onClick: () => setShareModalOpen(true) 
    }
  ]

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center border border-white/20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">羽迹</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            记录每一次挥拍，见证每一次进步
          </p>
          
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                登录中...
              </div>
            ) : (
              '开始记录'
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AppHeader
          user={user}
          isAdmin={isAdmin}
          onProfileClick={() => setProfileModalOpen(true)}
          onRankingClick={() => setRankingModalOpen(true)}
          onAdminDashboardClick={() => setAdminDashboardOpen(true)}
        />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <UserProfileSection
            user={user}
            onProfileClick={() => setProfileModalOpen(true)}
            onAchievementClick={() => setAchievementModalOpen(true)}
          />

          <TodayStatsSection
            todayMatches={todayMatches}
            onQuickRecord={() => setRecordModalOpen(true)}
          />

          <CircleSection
            myCircles={myCircles}
            onManageCircles={() => setCircleModalOpen(true)}
          />

          <QuickActionsGrid actions={quickActions} />

          <RecentMatchesList recentMatches={recentMatches} />
        </main>
      </div>

      <ModalManager
        recordModalOpen={recordModalOpen}
        setRecordModalOpen={setRecordModalOpen}
        statsModalOpen={statsModalOpen}
        setStatsModalOpen={setStatsModalOpen}
        goalModalOpen={goalModalOpen}
        setGoalModalOpen={setGoalModalOpen}
        shareModalOpen={shareModalOpen}
        setShareModalOpen={setShareModalOpen}
        profileModalOpen={profileModalOpen}
        setProfileModalOpen={setProfileModalOpen}
        rankingModalOpen={rankingModalOpen}
        setRankingModalOpen={setRankingModalOpen}
        achievementModalOpen={achievementModalOpen}
        setAchievementModalOpen={setAchievementModalOpen}
        circleModalOpen={circleModalOpen}
        setCircleModalOpen={setCircleModalOpen}
        adminDashboardOpen={adminDashboardOpen}
        setAdminDashboardOpen={setAdminDashboardOpen}
      />
    </>
  )
}
