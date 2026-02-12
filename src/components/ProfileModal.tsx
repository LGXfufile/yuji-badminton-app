'use client'

import React, { useState } from 'react'
import { X, User, Trophy, Target, Star, Camera, Upload, Shield } from 'lucide-react'
import { useUserStore } from '@/stores'
import PrivacyIndicator, { PrivacyStatusCard } from '@/components/PrivacyIndicator'
import { DEFAULT_PRIVACY_SETTINGS } from '@/types/privacy'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenPrivacySettings?: () => void
}

export default function ProfileModal({ isOpen, onClose, onOpenPrivacySettings }: ProfileModalProps) {
  const { user, updateUserStats, setUser } = useUserStore()
  
  // 获取用户隐私设置
  const userPrivacySettings = (() => {
    const saved = localStorage.getItem('userPrivacySettings')
    return saved ? JSON.parse(saved) : DEFAULT_PRIVACY_SETTINGS
  })()
  
  const [profileData, setProfileData] = useState({
    nickname: user?.nickname || '',
    level: user?.level || 1,
    playingYears: 2,
    height: 175,
    weight: 70,
    dominantHand: 'right' as 'left' | 'right',
    playingStyle: 'aggressive' as 'aggressive' | 'defensive' | 'balanced',
    favoriteShot: 'smash' as 'smash' | 'drop' | 'clear' | 'drive',
    club: '',
    coach: '',
    bio: '',
    achievements: [] as string[],
    socialLinks: {
      wechat: '',
      weibo: '',
      douyin: ''
    }
  })

  const [newAchievement, setNewAchievement] = useState('')

  const skillLevels = [
    { value: 1, label: 'Lv.1 新手', desc: '刚开始接触羽毛球' },
    { value: 2, label: 'Lv.2 入门', desc: '掌握基本动作' },
    { value: 3, label: 'Lv.3 初级', desc: '能进行简单对战' },
    { value: 4, label: 'Lv.4 中级', desc: '技术动作较为熟练' },
    { value: 5, label: 'Lv.5 中高级', desc: '具备一定战术意识' },
    { value: 6, label: 'Lv.6 高级', desc: '技术全面，战术丰富' },
    { value: 7, label: 'Lv.7 专业', desc: '接近专业水平' },
    { value: 8, label: 'Lv.8 精英', desc: '地区顶尖水平' },
    { value: 9, label: 'Lv.9 大师', desc: '省市级水平' },
    { value: 10, label: 'Lv.10 传奇', desc: '国家级水平' }
  ]

  const playingStyles = [
    { value: 'aggressive', label: '进攻型', desc: '喜欢主动进攻，快速得分' },
    { value: 'defensive', label: '防守型', desc: '擅长防守反击，耐心等待机会' },
    { value: 'balanced', label: '平衡型', desc: '攻守兼备，战术灵活' }
  ]

  const favoriteShots = [
    { value: 'smash', label: '杀球', icon: '💥' },
    { value: 'drop', label: '吊球', icon: '🎯' },
    { value: 'clear', label: '高远球', icon: '🚀' },
    { value: 'drive', label: '平抽球', icon: '⚡' }
  ]

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        nickname: profileData.nickname,
        level: profileData.level,
        // 可以扩展更多用户信息字段
      }
      setUser(updatedUser)
    }
    
    // 保存到本地存储
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    alert('个人资料已保存！')
    onClose()
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfileData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }))
      setNewAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">个人资料</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* 基本信息 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              基本信息
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                <input
                  type="text"
                  value={profileData.nickname}
                  onChange={(e) => setProfileData(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入昵称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">球龄（年）</label>
                <input
                  type="number"
                  value={profileData.playingYears}
                  onChange={(e) => setProfileData(prev => ({ ...prev, playingYears: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">身高（cm）</label>
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => setProfileData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="100"
                  max="250"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">体重（kg）</label>
                <input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => setProfileData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="30"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* 技术等级 */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-green-600" />
              技术等级
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setProfileData(prev => ({ ...prev, level: level.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    profileData.level === level.value
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 打球风格 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              打球风格
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">惯用手</label>
                <div className="flex space-x-4">
                  {[
                    { value: 'right', label: '右手' },
                    { value: 'left', label: '左手' }
                  ].map((hand) => (
                    <button
                      key={hand.value}
                      onClick={() => setProfileData(prev => ({ ...prev, dominantHand: hand.value as any }))}
                      className={`px-6 py-2 rounded-xl border-2 font-medium transition-all ${
                        profileData.dominantHand === hand.value
                          ? 'border-purple-500 bg-purple-100 text-purple-800'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {hand.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">打球类型</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {playingStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setProfileData(prev => ({ ...prev, playingStyle: style.value as any }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        profileData.playingStyle === style.value
                          ? 'border-purple-500 bg-purple-100 text-purple-800'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{style.label}</div>
                      <div className="text-sm text-gray-600">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">拿手技术</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {favoriteShots.map((shot) => (
                    <button
                      key={shot.value}
                      onClick={() => setProfileData(prev => ({ ...prev, favoriteShot: shot.value as any }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        profileData.favoriteShot === shot.value
                          ? 'border-purple-500 bg-purple-100 text-purple-800'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{shot.icon}</div>
                      <div className="font-medium text-sm">{shot.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 俱乐部和教练 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-orange-600" />
              俱乐部信息
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所属俱乐部</label>
                <input
                  type="text"
                  value={profileData.club}
                  onChange={(e) => setProfileData(prev => ({ ...prev, club: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="请输入俱乐部名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">指导教练</label>
                <input
                  type="text"
                  value={profileData.coach}
                  onChange={(e) => setProfileData(prev => ({ ...prev, coach: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="请输入教练姓名"
                />
              </div>
            </div>
          </div>

          {/* 个人成就 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              个人成就
            </h3>
            
            <div className="space-y-3 mb-4">
              {profileData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border">
                  <span className="text-gray-700">{achievement}</span>
                  <button
                    onClick={() => removeAchievement(index)}
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
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="添加个人成就（如：市级比赛冠军）"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
              />
              <button
                onClick={addAchievement}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
              >
                添加
              </button>
            </div>
          </div>

          {/* 隐私设置 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              隐私设置
            </h3>
            
            <div className="space-y-3 mb-4">
              <PrivacyStatusCard
                title="个人资料"
                description="昵称、头像、等级等基本信息的可见性"
                level={userPrivacySettings.modules.profile}
                onEdit={onOpenPrivacySettings}
              />
              
              <PrivacyStatusCard
                title="比赛数据"
                description="比赛记录和统计数据的可见性"
                level={userPrivacySettings.modules.statistics}
                onEdit={onOpenPrivacySettings}
              />
            </div>
            
            <button
              onClick={onOpenPrivacySettings}
              className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg font-medium transition-all"
            >
              管理隐私设置
            </button>
          </div>

          {/* 个人简介 */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">个人简介</h3>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="介绍一下你的羽毛球经历、特长、目标等..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 社交链接 */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">社交账号</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">微信号</label>
                <input
                  type="text"
                  value={profileData.socialLinks.wechat}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, wechat: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="微信号"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">微博</label>
                <input
                  type="text"
                  value={profileData.socialLinks.weibo}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, weibo: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="微博账号"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">抖音</label>
                <input
                  type="text"
                  value={profileData.socialLinks.douyin}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, douyin: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="抖音号"
                />
              </div>
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
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg font-medium"
            >
              保存资料
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}