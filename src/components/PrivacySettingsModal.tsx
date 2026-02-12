'use client'

import React, { useState } from 'react'
import { X, Shield, Eye, EyeOff, Users, Globe, Lock, Info, Settings } from 'lucide-react'
import { useUserStore } from '@/stores'
import { UserPrivacySettings, PrivacyLevel, PRIVACY_LEVELS, DEFAULT_PRIVACY_SETTINGS } from '@/types/privacy'

interface PrivacySettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacySettingsModal({ isOpen, onClose }: PrivacySettingsModalProps) {
  const { user, setUser } = useUserStore()
  
  // 从localStorage加载或使用默认设置
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>(() => {
    const saved = localStorage.getItem('userPrivacySettings')
    return saved ? JSON.parse(saved) : DEFAULT_PRIVACY_SETTINGS
  })

  const [activeTab, setActiveTab] = useState<'quick' | 'detailed' | 'advanced'>('quick')

  // 快速设置 - 一键设置所有模块
  const handleQuickSetting = (level: PrivacyLevel) => {
    const newSettings = {
      ...privacySettings,
      globalLevel: level,
      modules: {
        profile: level,
        matches: level,
        statistics: level,
        achievements: level,
        ranking: level,
        equipment: level === 'private' ? 'private' : 'circle', // 装备信息默认圈子可见
        social: 'private' // 社交信息始终私密
      }
    }
    setPrivacySettings(newSettings)
  }

  // 单独设置某个模块
  const handleModuleSetting = (module: keyof UserPrivacySettings['modules'], level: PrivacyLevel) => {
    setPrivacySettings(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: level
      }
    }))
  }

  // 高级设置切换
  const handleAdvancedToggle = (key: keyof UserPrivacySettings['advanced']) => {
    setPrivacySettings(prev => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: !prev.advanced[key]
      }
    }))
  }

  // 保存设置
  const handleSave = () => {
    // 保存到localStorage
    localStorage.setItem('userPrivacySettings', JSON.stringify(privacySettings))
    
    // 更新用户信息 (如果需要)
    if (user) {
      const updatedUser = {
        ...user,
        // 可以在用户对象中添加隐私设置字段
        privacySettings
      }
      setUser(updatedUser)
    }
    
    alert('隐私设置已保存！')
    onClose()
  }

  // 重置为默认设置
  const handleReset = () => {
    if (confirm('确定要重置为默认隐私设置吗？')) {
      setPrivacySettings(DEFAULT_PRIVACY_SETTINGS)
    }
  }

  if (!isOpen) return null

  const modules = [
    { key: 'profile', label: '个人资料', desc: '昵称、头像、等级等基本信息' },
    { key: 'matches', label: '比赛记录', desc: '具体比赛详情、对手信息' },
    { key: 'statistics', label: '统计数据', desc: '胜率、场次、排名等数据' },
    { key: 'achievements', label: '成就系统', desc: '解锁的成就和进度' },
    { key: 'ranking', label: '排行榜', desc: '是否显示在各类排行榜中' },
    { key: 'equipment', label: '装备信息', desc: '球拍、球鞋等装备详情' },
    { key: 'social', label: '社交信息', desc: '微信、微博等社交账号' }
  ] as const

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">隐私设置</h2>
              <p className="text-sm text-gray-600">控制你的数据可见性</p>
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
              { key: 'quick', label: '快速设置', icon: Settings },
              { key: 'detailed', label: '详细设置', icon: Eye },
              { key: 'advanced', label: '高级设置', icon: Shield }
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

          {/* 快速设置 */}
          {activeTab === 'quick' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  一键设置隐私级别
                </h3>
                <p className="text-blue-700 mb-6">
                  选择一个隐私级别，将应用到所有数据模块（社交信息除外，始终保持私密）
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(PRIVACY_LEVELS).map(([level, config]) => (
                    <button
                      key={level}
                      onClick={() => handleQuickSetting(level as PrivacyLevel)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                        privacySettings.globalLevel === level
                          ? `${config.borderColor} ${config.bgColor}`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{config.icon}</span>
                        <div>
                          <h4 className={`font-semibold ${config.color}`}>{config.label}</h4>
                          {privacySettings.globalLevel === level && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              当前设置
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 当前设置预览 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">当前隐私设置预览</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {modules.slice(0, 4).map((module) => {
                    const level = privacySettings.modules[module.key]
                    const config = PRIVACY_LEVELS[level]
                    return (
                      <div key={module.key} className="text-center p-3 bg-white rounded-xl border">
                        <div className="text-2xl mb-2">{config.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{module.label}</div>
                        <div className={`text-xs ${config.color}`}>{config.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 详细设置 */}
          {activeTab === 'detailed' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">个性化隐私控制</h4>
                    <p className="text-sm text-yellow-700">
                      你可以为每个数据模块单独设置隐私级别，实现精细化的隐私控制。
                    </p>
                  </div>
                </div>
              </div>

              {modules.map((module) => (
                <div key={module.key} className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{module.label}</h4>
                      <p className="text-sm text-gray-600">{module.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {Object.entries(PRIVACY_LEVELS).map(([level, config]) => (
                        <button
                          key={level}
                          onClick={() => handleModuleSetting(module.key, level as PrivacyLevel)}
                          className={`p-2 rounded-xl border-2 transition-all ${
                            privacySettings.modules[module.key] === level
                              ? `${config.borderColor} ${config.bgColor}`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={config.label}
                        >
                          <span className="text-lg">{config.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500">当前设置:</span>
                    <span className={PRIVACY_LEVELS[privacySettings.modules[module.key]].color}>
                      {PRIVACY_LEVELS[privacySettings.modules[module.key]].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 高级设置 */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  高级隐私控制
                </h3>
                
                <div className="space-y-4">
                  {[
                    {
                      key: 'allowFriendRequests',
                      label: '允许好友申请',
                      desc: '其他用户可以向你发送好友申请'
                    },
                    {
                      key: 'showOnlineStatus',
                      label: '显示在线状态',
                      desc: '让其他用户看到你的在线状态'
                    },
                    {
                      key: 'allowDataExport',
                      label: '允许数据导出',
                      desc: '允许导出你的个人数据'
                    },
                    {
                      key: 'searchable',
                      label: '允许被搜索',
                      desc: '其他用户可以通过昵称搜索到你'
                    }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.desc}</p>
                      </div>
                      <button
                        onClick={() => handleAdvancedToggle(setting.key as keyof UserPrivacySettings['advanced'])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.advanced[setting.key as keyof UserPrivacySettings['advanced']]
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacySettings.advanced[setting.key as keyof UserPrivacySettings['advanced']]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 数据管理 */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4">数据管理</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-white border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors">
                    导出我的数据
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full p-3 bg-white border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    重置隐私设置
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex space-x-4 pt-6 mt-6 border-t border-gray-200">
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
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}