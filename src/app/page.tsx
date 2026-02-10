'use client'

import React, { useEffect } from 'react'
import { useUserStore, useMatchStore } from '@/stores'
import { User, Trophy, Target, Calendar, TrendingUp, Play } from 'lucide-react'
import dayjs from 'dayjs'

export default function HomePage() {
  const { user, isLoggedIn, login, loading } = useUserStore()
  const { matches, loadMatches } = useMatchStore()

  useEffect(() => {
    if (isLoggedIn) {
      loadMatches()
    }
  }, [isLoggedIn, loadMatches])

  const handleLogin = async () => {
    await login()
  }

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

  const recentMatches = matches.slice(0, 3)
  const todayMatches = matches.filter(match => {
    const today = new Date()
    const matchDate = new Date(match.date)
    return matchDate.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
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
                src={user?.avatarUrl || '/images/default-avatar.png'}
                alt="头像"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <span className="text-gray-700 font-medium">{user?.nickname}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex flex-col items-center lg:items-start">
              <img 
                src={user?.avatarUrl || '/images/default-avatar.png'}
                alt="头像"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.nickname}</h2>
              <div className="flex items-center text-blue-600 font-medium">
                <Target className="w-4 h-4 mr-1" />
                技术等级: Lv.{user?.level || 1}
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

        {/* 今日统计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">今日战绩</h3>
          </div>
          
          {todayMatches.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200/30">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    已完成 {todayMatches.length} 场比赛
                  </div>
                  <div className="text-green-600 font-medium">
                    胜 {todayMatches.filter(m => m.winner === 'teamA').length} 场
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-6">今天还没有比赛记录</p>
              <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                立即记录
              </button>
            </div>
          )}
        </div>

        {/* 快捷操作 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">快捷操作</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🏸', text: '记录比赛', color: 'from-blue-500 to-blue-600' },
              { icon: '📊', text: '查看数据', color: 'from-green-500 to-green-600' },
              { icon: '🎯', text: '设置目标', color: 'from-purple-500 to-purple-600' },
              { icon: '📷', text: '分享战绩', color: 'from-orange-500 to-orange-600' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-center`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <div className="font-semibold">{action.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 最近比赛 */}
        {recentMatches.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">最近比赛</h3>
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/30">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {match.type === 'singles' ? '单打' : 
                         match.type === 'doubles' ? '双打' : '混双'}
                      </span>
                      <span className="text-gray-600">{match.venue}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {dayjs(match.date).format('YYYY年MM月DD日')}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold mb-1 ${
                      match.winner === 'teamA' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {match.score.teamA} : {match.score.teamB}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.winner === 'teamA' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {match.winner === 'teamA' ? '胜' : '负'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
