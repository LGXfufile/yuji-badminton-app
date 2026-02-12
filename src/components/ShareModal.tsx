'use client'

import React, { useState, useRef } from 'react'
import { X, Share2, Download, Copy, Camera, Trophy, Calendar, MapPin, Clock } from 'lucide-react'
import { useUserStore, useMatchStore } from '@/stores'
import dayjs from 'dayjs'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { user } = useUserStore()
  const { matches } = useMatchStore()
  const [shareType, setShareType] = useState<'recent' | 'stats' | 'achievement'>('recent')
  const [selectedMatch, setSelectedMatch] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const recentMatches = matches.slice(0, 5)
  const totalMatches = matches.length
  const wins = matches.filter(m => m.winner === 'teamA').length
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0

  const generateShareImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布尺寸
    canvas.width = 800
    canvas.height = 600

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#3B82F6')
    gradient.addColorStop(1, '#10B981')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // 添加装饰图案
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * 800, Math.random() * 600, Math.random() * 30 + 10, 0, Math.PI * 2)
      ctx.fill()
    }

    // 主标题
    ctx.fillStyle = 'white'
    ctx.font = 'bold 48px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('羽迹', 400, 80)

    // 副标题
    ctx.font = '24px Inter, sans-serif'
    ctx.fillText('羽毛球记录分享', 400, 120)

    if (shareType === 'stats') {
      // 统计数据分享
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillRect(100, 180, 600, 300)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.strokeRect(100, 180, 600, 300)

      ctx.fillStyle = '#1F2937'
      ctx.font = 'bold 32px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${user?.nickname || '羽毛球爱好者'} 的战绩`, 400, 230)

      // 数据展示
      const stats = [
        { label: '总场次', value: totalMatches.toString() },
        { label: '胜率', value: `${winRate.toFixed(1)}%` },
        { label: '胜场', value: wins.toString() },
        { label: '等级', value: `Lv.${user?.level || 1}` }
      ]

      stats.forEach((stat, index) => {
        const x = 200 + (index % 2) * 300
        const y = 300 + Math.floor(index / 2) * 80

        ctx.font = 'bold 36px Inter, sans-serif'
        ctx.fillStyle = '#3B82F6'
        ctx.textAlign = 'center'
        ctx.fillText(stat.value, x, y)

        ctx.font = '18px Inter, sans-serif'
        ctx.fillStyle = '#6B7280'
        ctx.fillText(stat.label, x, y + 25)
      })

    } else if (shareType === 'recent' && selectedMatch) {
      // 比赛结果分享
      const match = matches.find(m => m._id === selectedMatch)
      if (match) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.fillRect(100, 180, 600, 300)

        ctx.fillStyle = '#1F2937'
        ctx.font = 'bold 28px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('比赛结果', 400, 220)

        // 比分
        ctx.font = 'bold 48px Inter, sans-serif'
        const scoreColor = match.winner === 'teamA' ? '#10B981' : '#EF4444'
        ctx.fillStyle = scoreColor
        ctx.fillText(`${match.score.teamA} : ${match.score.teamB}`, 400, 280)

        // 比赛信息
        ctx.font = '18px Inter, sans-serif'
        ctx.fillStyle = '#6B7280'
        ctx.fillText(`${match.venue} · ${dayjs(match.date).format('MM月DD日')}`, 400, 320)

        // 结果
        ctx.font = 'bold 24px Inter, sans-serif'
        ctx.fillStyle = scoreColor
        ctx.fillText(match.winner === 'teamA' ? '胜利' : '失败', 400, 360)
      }
    } else {
      // 成就分享
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillRect(100, 180, 600, 300)

      ctx.fillStyle = '#1F2937'
      ctx.font = 'bold 32px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('🏆 新成就解锁', 400, 240)

      ctx.font = '24px Inter, sans-serif'
      ctx.fillText('连胜达人', 400, 280)

      ctx.font = '18px Inter, sans-serif'
      ctx.fillStyle = '#6B7280'
      ctx.fillText('恭喜获得3连胜！', 400, 320)
    }

    // 底部信息
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '16px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('羽迹 - 记录每一次挥拍，见证每一次进步', 400, 550)
  }

  const downloadImage = async () => {
    await generateShareImage()
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `羽迹分享-${dayjs().format('YYYY-MM-DD')}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const copyToClipboard = async () => {
    let text = ''
    
    if (shareType === 'stats') {
      text = `🏸 我的羽毛球战绩
📊 总场次：${totalMatches}
🏆 胜率：${winRate.toFixed(1)}%
⭐ 等级：Lv.${user?.level || 1}

来羽迹一起记录你的羽毛球之路吧！`
    } else if (shareType === 'recent' && selectedMatch) {
      const match = matches.find(m => m._id === selectedMatch)
      if (match) {
        text = `🏸 比赛结果分享
📍 ${match.venue}
📅 ${dayjs(match.date).format('YYYY年MM月DD日')}
🏆 ${match.score.teamA} : ${match.score.teamB} ${match.winner === 'teamA' ? '胜利！' : ''}

#羽毛球 #运动记录 #羽迹`
      }
    } else {
      text = `🏆 解锁新成就：连胜达人
🎯 恭喜获得3连胜！

继续加油，向更高目标前进！
#羽毛球 #成就解锁 #羽迹`
    }

    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板！')
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const shareToSocial = (platform: string) => {
    let text = ''
    let url = window.location.origin

    if (shareType === 'stats') {
      text = `我在羽迹记录了${totalMatches}场比赛，胜率${winRate.toFixed(1)}%！一起来记录你的羽毛球之路吧！`
    } else if (shareType === 'recent' && selectedMatch) {
      const match = matches.find(m => m._id === selectedMatch)
      if (match) {
        text = `刚在${match.venue}打了一场${match.type === 'singles' ? '单打' : '双打'}，比分${match.score.teamA}:${match.score.teamB}！`
      }
    }

    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)

    let shareUrl = ''
    switch (platform) {
      case 'wechat':
        // 微信分享通常需要SDK，这里模拟
        alert('请使用微信扫码分享功能')
        break
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`
        break
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedText}`
        break
      default:
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">分享战绩</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 分享类型选择 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">选择分享内容</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'recent', label: '比赛结果', icon: Trophy },
                { value: 'stats', label: '整体数据', icon: Calendar },
                { value: 'achievement', label: '成就解锁', icon: Share2 }
              ].map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setShareType(type.value as any)}
                    className={`p-4 rounded-xl border-2 font-medium transition-all text-center ${
                      shareType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 比赛选择 */}
          {shareType === 'recent' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">选择比赛</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {recentMatches.map((match) => (
                  <button
                    key={match._id}
                    onClick={() => setSelectedMatch(match._id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMatch === match._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {match.type === 'singles' ? '单打' : '双打'}
                          </span>
                          <span className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {match.venue}
                          </span>
                          <span className="flex items-center text-gray-600 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {match.duration}分钟
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {dayjs(match.date).format('YYYY年MM月DD日')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          match.winner === 'teamA' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {match.score.teamA} : {match.score.teamB}
                        </div>
                        <div className={`text-sm font-medium ${
                          match.winner === 'teamA' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {match.winner === 'teamA' ? '胜' : '负'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 预览区域 */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分享预览</h3>
            <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-xl p-6 text-white text-center">
              <div className="text-2xl font-bold mb-2">羽迹</div>
              <div className="text-sm opacity-90 mb-4">羽毛球记录分享</div>
              
              {shareType === 'stats' && (
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-lg font-semibold mb-3">{user?.nickname || '羽毛球爱好者'} 的战绩</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold">{totalMatches}</div>
                      <div className="opacity-80">总场次</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                      <div className="opacity-80">胜率</div>
                    </div>
                  </div>
                </div>
              )}

              {shareType === 'recent' && selectedMatch && (
                <div className="bg-white/20 rounded-lg p-4">
                  {(() => {
                    const match = matches.find(m => m._id === selectedMatch)
                    return match ? (
                      <>
                        <div className="text-lg font-semibold mb-2">比赛结果</div>
                        <div className="text-3xl font-bold mb-2">
                          {match.score.teamA} : {match.score.teamB}
                        </div>
                        <div className="text-sm opacity-80">
                          {match.venue} · {dayjs(match.date).format('MM月DD日')}
                        </div>
                      </>
                    ) : null
                  })()}
                </div>
              )}

              {shareType === 'achievement' && (
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-lg font-semibold mb-1">新成就解锁</div>
                  <div className="text-xl font-bold mb-2">连胜达人</div>
                  <div className="text-sm opacity-80">恭喜获得3连胜！</div>
                </div>
              )}
            </div>
          </div>

          {/* 分享操作 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">分享方式</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={downloadImage}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>下载图片</span>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center space-x-2 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Copy className="w-5 h-5" />
                <span>复制文字</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => shareToSocial('wechat')}
                className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <span>微信</span>
              </button>
              
              <button
                onClick={() => shareToSocial('weibo')}
                className="flex items-center justify-center space-x-2 p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                <span>微博</span>
              </button>
              
              <button
                onClick={() => shareToSocial('qq')}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <span>QQ</span>
              </button>
            </div>
          </div>

          {/* 隐藏的canvas用于生成图片 */}
          <canvas
            ref={canvasRef}
            className="hidden"
            width={800}
            height={600}
          />
        </div>
      </div>
    </div>
  )
}