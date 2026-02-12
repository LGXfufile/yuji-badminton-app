'use client'

import React, { useState } from 'react'
import { X, Trophy, Share2, Download, Camera, Star, Medal, Crown, Zap } from 'lucide-react'
import { useUserStore, useMatchStore } from '@/stores'
import dayjs from 'dayjs'

interface RankingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RankingModal({ isOpen, onClose }: RankingModalProps) {
  const { user } = useUserStore()
  const { matches } = useMatchStore()
  const [selectedTab, setSelectedTab] = useState<'local' | 'city' | 'national'>('local')

  // 模拟排行榜数据
  const mockRankings = {
    local: [
      { rank: 1, name: '羽球王者', level: 8, winRate: 92.5, matches: 156, points: 2850, avatar: '👑', badge: '本地王者' },
      { rank: 2, name: '羽毛球达人', level: 5, winRate: 75.0, matches: 12, points: 1200, avatar: '🏆', badge: '进步之星', isCurrentUser: true },
      { rank: 3, name: '技术流', level: 7, winRate: 88.2, matches: 89, points: 2100, avatar: '⚡', badge: '技术大师' },
      { rank: 4, name: '防守专家', level: 6, winRate: 82.1, matches: 67, points: 1850, avatar: '🛡️', badge: '防守之王' },
      { rank: 5, name: '新星崛起', level: 4, winRate: 78.5, matches: 45, points: 980, avatar: '🌟', badge: '潜力新星' },
      { rank: 6, name: '老将风采', level: 7, winRate: 85.3, matches: 134, points: 2200, avatar: '🎖️', badge: '经验丰富' },
      { rank: 7, name: '速度之王', level: 5, winRate: 73.2, matches: 78, points: 1450, avatar: '💨', badge: '速度专家' },
      { rank: 8, name: '力量型', level: 6, winRate: 79.8, matches: 92, points: 1680, avatar: '💪', badge: '力量之王' }
    ],
    city: [
      { rank: 1, name: '市级冠军', level: 9, winRate: 94.8, matches: 234, points: 4200, avatar: '👑', badge: '市级王者' },
      { rank: 15, name: '羽毛球达人', level: 5, winRate: 75.0, matches: 12, points: 1200, avatar: '🏆', badge: '进步之星', isCurrentUser: true },
      { rank: 2, name: '技术大神', level: 8, winRate: 91.2, matches: 189, points: 3850, avatar: '⚡', badge: '技术之神' },
      { rank: 3, name: '双打王者', level: 8, winRate: 89.5, matches: 167, points: 3600, avatar: '👥', badge: '双打专家' }
    ],
    national: [
      { rank: 1, name: '全国冠军', level: 10, winRate: 96.2, matches: 456, points: 8900, avatar: '👑', badge: '全国王者' },
      { rank: 156, name: '羽毛球达人', level: 5, winRate: 75.0, matches: 12, points: 1200, avatar: '🏆', badge: '进步之星', isCurrentUser: true },
      { rank: 2, name: '职业选手A', level: 10, winRate: 95.1, matches: 389, points: 8200, avatar: '⚡', badge: '职业选手' }
    ]
  }

  const currentRanking = mockRankings[selectedTab]
  const userRank = currentRanking.find(r => r.isCurrentUser)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
  }

  const generateRankingCard = () => {
    // 生成排行榜分享卡片的逻辑
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#1E40AF')
    gradient.addColorStop(1, '#7C3AED')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // 标题
    ctx.fillStyle = 'white'
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('羽迹排行榜', 400, 80)

    // 用户信息
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(100, 150, 600, 200)

    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 28px Arial'
    ctx.fillText(`${user?.nickname} 的排名`, 400, 200)

    ctx.font = '24px Arial'
    ctx.fillText(`${selectedTab === 'local' ? '本地' : selectedTab === 'city' ? '城市' : '全国'}排名: #${userRank?.rank}`, 400, 240)
    ctx.fillText(`胜率: ${userRank?.winRate}%`, 400, 280)
    ctx.fillText(`等级: Lv.${userRank?.level}`, 400, 320)

    // 下载图片
    const link = document.createElement('a')
    link.download = `羽迹排行榜-${dayjs().format('YYYY-MM-DD')}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">排行榜</h2>
              <p className="text-sm text-gray-600">与其他球友一较高下</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={generateRankingCard}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="分享排名"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 我的排名卡片 */}
          {userRank && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{userRank.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold">{userRank.name}</h3>
                    <p className="text-blue-100">{userRank.badge}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">#{userRank.rank}</div>
                  <div className="text-blue-100">
                    {selectedTab === 'local' ? '本地排名' : 
                     selectedTab === 'city' ? '城市排名' : '全国排名'}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{userRank.level}</div>
                  <div className="text-sm text-blue-100">等级</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userRank.winRate}%</div>
                  <div className="text-sm text-blue-100">胜率</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userRank.matches}</div>
                  <div className="text-sm text-blue-100">场次</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userRank.points}</div>
                  <div className="text-sm text-blue-100">积分</div>
                </div>
              </div>
            </div>
          )}

          {/* 排行榜类型切换 */}
          <div className="flex space-x-2 mb-6">
            {[
              { key: 'local', label: '本地排行', desc: '附近球友' },
              { key: 'city', label: '城市排行', desc: '全市排名' },
              { key: 'national', label: '全国排行', desc: '全国排名' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                  selectedTab === tab.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
                <div className="text-sm text-gray-600">{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* 排行榜列表 */}
          <div className="space-y-3">
            {currentRanking.slice(0, 10).map((player) => (
              <div
                key={player.rank}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  player.isCurrentUser
                    ? 'border-blue-500 bg-blue-50'
                    : player.rank <= 3
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                      {getRankIcon(player.rank)}
                    </div>
                    <div className="text-3xl">{player.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900">{player.name}</h3>
                        {player.isCurrentUser && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            我
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {player.badge}
                        </span>
                        <span>Lv.{player.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold text-green-600">{player.winRate}%</div>
                        <div className="text-xs text-gray-500">胜率</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-600">{player.matches}</div>
                        <div className="text-xs text-gray-500">场次</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-600">{player.points}</div>
                        <div className="text-xs text-gray-500">积分</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 积分规则说明 */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              积分规则
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>胜利一场：</span>
                  <span className="font-medium text-green-600">+50 积分</span>
                </div>
                <div className="flex justify-between">
                  <span>失败一场：</span>
                  <span className="font-medium text-red-600">-20 积分</span>
                </div>
                <div className="flex justify-between">
                  <span>连胜奖励：</span>
                  <span className="font-medium text-blue-600">+10 积分/连胜</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>完成成就：</span>
                  <span className="font-medium text-purple-600">+100 积分</span>
                </div>
                <div className="flex justify-between">
                  <span>每日签到：</span>
                  <span className="font-medium text-orange-600">+10 积分</span>
                </div>
                <div className="flex justify-between">
                  <span>分享战绩：</span>
                  <span className="font-medium text-pink-600">+5 积分</span>
                </div>
              </div>
            </div>
          </div>

          {/* 激励文案 */}
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 text-center">
            <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">冲击更高排名！</h3>
            <p className="text-yellow-700">
              每一场比赛都是提升排名的机会，坚持训练，超越自我！
              <br />
              下一个目标：进入前{Math.max(1, (userRank?.rank || 10) - 1)}名！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}