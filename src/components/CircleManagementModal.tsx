'use client'

import React, { useState } from 'react'
import { X, Users, Plus, Settings, MapPin, Tag, Globe, Lock, UserCheck, Search, Crown, Shield, Star } from 'lucide-react'
import { Circle, CircleMembership, CIRCLE_TYPES } from '@/types/privacy'
import { useUserStore, useCircleStore } from '@/stores'

interface CircleManagementModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'create' | 'join' | 'manage'
  circle?: Circle
}

export default function CircleManagementModal({ 
  isOpen, 
  onClose, 
  mode = 'create',
  circle 
}: CircleManagementModalProps) {
  const { user } = useUserStore()
  const { circles, myCircles: storeMyCircles, myMemberships, createCircle, joinCircle, searchCircles, loading } = useCircleStore()
  const [activeTab, setActiveTab] = useState<'create' | 'join' | 'my-circles'>('create')
  
  // 创建圈子表单状态
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    type: 'friends' as Circle['type'],
    privacy: 'public' as Circle['privacy'],
    location: '',
    tags: [] as string[],
    maxMembers: 50,
    settings: {
      allowInvites: true,
      requireApproval: false,
      allowEvents: true,
      allowRanking: true
    }
  })

  // 搜索圈子状态
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Circle[]>([])

  // 模拟圈子数据
  const mockCircles: Circle[] = [
    {
      id: 'circle_1',
      name: '奥体中心羽毛球俱乐部',
      description: '专业的羽毛球训练和比赛，欢迎各个水平的球友加入',
      avatar: '🏢',
      type: 'club',
      privacy: 'public',
      memberCount: 156,
      maxMembers: 200,
      location: '奥体中心',
      tags: ['专业训练', '比赛', '技术提升'],
      createdBy: 'user_1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      settings: {
        allowInvites: true,
        requireApproval: true,
        allowEvents: true,
        allowRanking: true
      },
      stats: {
        activeMembers: 89,
        totalMatches: 1234,
        eventsCount: 45,
        avgLevel: 6.2
      }
    },
    {
      id: 'circle_2',
      name: '周末羽毛球好友圈',
      description: '轻松愉快的周末羽毛球活动，重在参与和交流',
      avatar: '👥',
      type: 'friends',
      privacy: 'invite_only',
      memberCount: 23,
      maxMembers: 30,
      location: '市体育馆',
      tags: ['休闲', '周末', '好友'],
      createdBy: 'user_2',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date(),
      settings: {
        allowInvites: true,
        requireApproval: false,
        allowEvents: true,
        allowRanking: false
      },
      stats: {
        activeMembers: 18,
        totalMatches: 89,
        eventsCount: 12,
        avgLevel: 4.5
      }
    },
    {
      id: 'circle_3',
      name: '大学城羽毛球联盟',
      description: '大学生羽毛球爱好者的聚集地，青春活力无限',
      avatar: '🏫',
      type: 'school',
      privacy: 'approval_required',
      memberCount: 89,
      maxMembers: 100,
      location: '大学城体育中心',
      tags: ['学生', '青春', '活力'],
      createdBy: 'user_3',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date(),
      settings: {
        allowInvites: false,
        requireApproval: true,
        allowEvents: true,
        allowRanking: true
      },
      stats: {
        activeMembers: 67,
        totalMatches: 456,
        eventsCount: 23,
        avgLevel: 3.8
      }
    }
  ]

  // 处理创建圈子
  const handleCreateCircle = async () => {
    if (!createForm.name.trim()) {
      alert('请输入圈子名称')
      return
    }

    try {
      await createCircle({
        name: createForm.name,
        description: createForm.description,
        avatar: CIRCLE_TYPES[createForm.type].icon,
        type: createForm.type,
        privacy: createForm.privacy,
        maxMembers: createForm.maxMembers,
        location: createForm.location,
        tags: createForm.tags,
        createdBy: user?._id || 'current_user',
        settings: createForm.settings
      })

      // 重置表单
      setCreateForm({
        name: '',
        description: '',
        type: 'friends',
        privacy: 'public',
        location: '',
        tags: [],
        maxMembers: 50,
        settings: {
          allowInvites: true,
          requireApproval: false,
          allowEvents: true,
          allowRanking: true
        }
      })

      alert('圈子创建成功！')
      setActiveTab('my-circles') // 切换到我的圈子标签页
    } catch (error) {
      alert('创建圈子失败，请重试')
    }
  }

  // 处理加入圈子
  const handleJoinCircle = async (circle: Circle) => {
    try {
      await joinCircle(circle.id)
      alert(`已成功加入"${circle.name}"`)
      setActiveTab('my-circles') // 切换到我的圈子标签页
    } catch (error) {
      alert(`加入圈子失败，请重试`)
    }
  }

  // 处理搜索
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      const results = await searchCircles(searchQuery)
      setSearchResults(results)
    } catch (error) {
      alert('搜索失败，请重试')
    }
  }

  // 添加标签
  const addTag = (tag: string) => {
    if (tag.trim() && !createForm.tags.includes(tag.trim())) {
      setCreateForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setCreateForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">圈子管理</h2>
              <p className="text-sm text-gray-600">创建或加入羽毛球圈子</p>
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
          {/* 标签页导航 */}
          <div className="flex space-x-2 mb-6">
            {[
              { key: 'create', label: '创建圈子', icon: Plus },
              { key: 'join', label: '发现圈子', icon: Search },
              { key: 'my-circles', label: '我的圈子', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* 创建圈子 */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  创建新圈子
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        圈子名称 *
                      </label>
                      <input
                        type="text"
                        value={createForm.name}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="输入圈子名称"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        圈子描述
                      </label>
                      <textarea
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="描述圈子的特色和目标"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        圈子类型
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(CIRCLE_TYPES).map(([type, config]) => (
                          <button
                            key={type}
                            onClick={() => setCreateForm(prev => ({ ...prev, type: type as Circle['type'] }))}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                              createForm.type === type
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{config.icon}</span>
                              <span className={`font-medium ${config.color}`}>{config.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        地理位置
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={createForm.location}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="输入活动地点"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 设置选项 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        隐私设置
                      </label>
                      <div className="space-y-2">
                        {[
                          { key: 'public', label: '公开', desc: '任何人都可以找到并加入', icon: '🌍' },
                          { key: 'invite_only', label: '仅邀请', desc: '只能通过邀请加入', icon: '👥' },
                          { key: 'approval_required', label: '需要审核', desc: '申请后需要管理员审核', icon: '🔒' }
                        ].map((option) => (
                          <button
                            key={option.key}
                            onClick={() => setCreateForm(prev => ({ ...prev, privacy: option.key as Circle['privacy'] }))}
                            className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                              createForm.privacy === option.key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{option.icon}</span>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-600">{option.desc}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最大成员数
                      </label>
                      <input
                        type="number"
                        value={createForm.maxMembers}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 50 }))}
                        min="5"
                        max="500"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        圈子标签
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {createForm.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="输入标签后按回车添加"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* 高级设置 */}
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">圈子权限设置</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'allowInvites', label: '允许成员邀请', desc: '成员可以邀请新人加入' },
                      { key: 'allowEvents', label: '允许创建活动', desc: '成员可以创建约球活动' },
                      { key: 'allowRanking', label: '参与排行榜', desc: '圈子参与排名竞争' },
                      { key: 'requireApproval', label: '加入需审核', desc: '新成员加入需要审核' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{setting.label}</div>
                          <div className="text-sm text-gray-600">{setting.desc}</div>
                        </div>
                        <button
                          onClick={() => setCreateForm(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              [setting.key]: !prev.settings[setting.key as keyof typeof prev.settings]
                            }
                          }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            createForm.settings[setting.key as keyof typeof createForm.settings]
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              createForm.settings[setting.key as keyof typeof createForm.settings]
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreateCircle}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg font-medium"
                  >
                    创建圈子
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 发现圈子 */}
          {activeTab === 'join' && (
            <div className="space-y-6">
              {/* 搜索栏 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索圈子名称、描述或标签"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium"
                  >
                    搜索
                  </button>
                </div>
              </div>

              {/* 推荐圈子 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐圈子</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(searchResults.length > 0 ? searchResults : circles).map((circle) => (
                    <div key={circle.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{circle.avatar}</div>
                          <div>
                            <h4 className="font-bold text-gray-900">{circle.name}</h4>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className={`px-2 py-1 rounded-full ${CIRCLE_TYPES[circle.type].color} bg-opacity-10`}>
                                {CIRCLE_TYPES[circle.type].label}
                              </span>
                              <span className="text-gray-500">
                                {circle.privacy === 'public' ? '🌍 公开' : 
                                 circle.privacy === 'invite_only' ? '👥 仅邀请' : '🔒 需审核'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinCircle(circle)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm font-medium"
                        >
                          {circle.privacy === 'public' ? '立即加入' : '申请加入'}
                        </button>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{circle.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span>👥 {circle.memberCount}/{circle.maxMembers}</span>
                          <span>📍 {circle.location}</span>
                          <span>⭐ Lv.{circle.stats.avgLevel.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {circle.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 我的圈子 */}
          {activeTab === 'my-circles' && (
            <div className="space-y-6">
              {storeMyCircles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {storeMyCircles.map((circle) => {
                    const membership = myMemberships.find(m => m.circleId === circle.id)
                    return (
                      <div key={circle.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{circle.avatar}</div>
                            <div>
                              <h4 className="font-bold text-gray-900">{circle.name}</h4>
                              <div className="flex items-center space-x-2 text-sm">
                                <span className={`px-2 py-1 rounded-full ${CIRCLE_TYPES[circle.type].color} bg-opacity-10`}>
                                  {CIRCLE_TYPES[circle.type].label}
                                </span>
                                {membership && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    membership.role === 'owner' ? 'bg-yellow-100 text-yellow-700' :
                                    membership.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {membership.role === 'owner' ? '圈主' :
                                     membership.role === 'admin' ? '管理员' : '成员'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{circle.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <span>👥 {circle.memberCount}/{circle.maxMembers}</span>
                            <span>📍 {circle.location}</span>
                            <span>⭐ Lv.{circle.stats.avgLevel.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {circle.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有加入任何圈子</h3>
                  <p className="text-gray-600 mb-6">创建或加入圈子，开始你的社交羽毛球之旅</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium"
                    >
                      创建圈子
                    </button>
                    <button
                      onClick={() => setActiveTab('join')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                    >
                      发现圈子
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}