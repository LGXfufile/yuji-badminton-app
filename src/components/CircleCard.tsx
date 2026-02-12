'use client'

import React from 'react'
import { Users, MapPin, Crown, Shield, Star, Settings, ExternalLink, UserPlus, MessageCircle } from 'lucide-react'
import { Circle, CircleMembership, CIRCLE_TYPES } from '@/types/privacy'
import PrivacyIndicator from './PrivacyIndicator'

interface CircleCardProps {
  circle: Circle
  membership?: CircleMembership
  onJoin?: (circle: Circle) => void
  onLeave?: (circle: Circle) => void
  onManage?: (circle: Circle) => void
  onViewDetails?: (circle: Circle) => void
  className?: string
}

export default function CircleCard({ 
  circle, 
  membership, 
  onJoin, 
  onLeave, 
  onManage, 
  onViewDetails,
  className = '' 
}: CircleCardProps) {
  const typeConfig = CIRCLE_TYPES[circle.type]
  const isOwner = membership?.role === 'owner'
  const isAdmin = membership?.role === 'admin'
  const isMember = !!membership

  const getRoleIcon = (role: CircleMembership['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const getPrivacyIcon = (privacy: Circle['privacy']) => {
    switch (privacy) {
      case 'public':
        return '🌍'
      case 'invite_only':
        return '👥'
      case 'approval_required':
        return '🔒'
      default:
        return '🌍'
    }
  }

  const getPrivacyLabel = (privacy: Circle['privacy']) => {
    switch (privacy) {
      case 'public':
        return '公开'
      case 'invite_only':
        return '仅邀请'
      case 'approval_required':
        return '需审核'
      default:
        return '公开'
    }
  }

  return (
    <div className={`bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden ${className}`}>
      {/* 圈子头部 */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                {circle.avatar}
              </div>
              {isMember && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                  {getRoleIcon(membership.role)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg">{circle.name}</h3>
                {isMember && membership.role === 'owner' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    圈主
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color} bg-opacity-10`}>
                  <span className="mr-1">{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
                <span className="inline-flex items-center text-gray-500">
                  <span className="mr-1">{getPrivacyIcon(circle.privacy)}</span>
                  {getPrivacyLabel(circle.privacy)}
                </span>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            {!isMember && onJoin && (
              <button
                onClick={() => onJoin(circle)}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-1 inline" />
                {circle.privacy === 'public' ? '加入' : '申请'}
              </button>
            )}
            
            {isMember && (isOwner || isAdmin) && onManage && (
              <button
                onClick={() => onManage(circle)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="管理圈子"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(circle)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="查看详情"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 圈子描述 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{circle.description}</p>

        {/* 圈子统计 */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{circle.memberCount}</div>
            <div className="text-xs text-gray-500">成员</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{circle.stats.activeMembers}</div>
            <div className="text-xs text-gray-500">活跃</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{circle.stats.totalMatches}</div>
            <div className="text-xs text-gray-500">比赛</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{circle.stats.avgLevel.toFixed(1)}</div>
            <div className="text-xs text-gray-500">平均等级</div>
          </div>
        </div>

        {/* 地理位置 */}
        {circle.location && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {circle.location}
          </div>
        )}

        {/* 标签 */}
        {circle.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {circle.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {circle.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{circle.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 圈子底部操作栏 */}
      {isMember && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>加入于 {new Date(membership.joinedAt).toLocaleDateString()}</span>
              {membership.circleProfile.nickname && (
                <span>圈内昵称: {membership.circleProfile.nickname}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              
              {onLeave && !isOwner && (
                <button
                  onClick={() => onLeave(circle)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors"
                >
                  退出
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 非成员底部信息 */}
      {!isMember && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>👥 {circle.memberCount}/{circle.maxMembers} 成员</span>
              <span>📅 创建于 {new Date(circle.createdAt).toLocaleDateString()}</span>
            </div>
            
            {circle.settings.allowRanking && (
              <div className="flex items-center text-yellow-600">
                <Star className="w-4 h-4 mr-1" />
                <span>参与排行榜</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// 圈子列表组件
interface CircleListProps {
  circles: Circle[]
  memberships?: CircleMembership[]
  onJoin?: (circle: Circle) => void
  onLeave?: (circle: Circle) => void
  onManage?: (circle: Circle) => void
  onViewDetails?: (circle: Circle) => void
  className?: string
}

export function CircleList({ 
  circles, 
  memberships = [], 
  onJoin, 
  onLeave, 
  onManage, 
  onViewDetails,
  className = '' 
}: CircleListProps) {
  const getMembership = (circleId: string) => {
    return memberships.find(m => m.circleId === circleId)
  }

  if (circles.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无圈子</h3>
        <p className="text-gray-600">还没有找到相关的圈子</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {circles.map((circle) => (
        <CircleCard
          key={circle.id}
          circle={circle}
          membership={getMembership(circle.id)}
          onJoin={onJoin}
          onLeave={onLeave}
          onManage={onManage}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}

// 圈子统计卡片组件
interface CircleStatsCardProps {
  circle: Circle
  membership?: CircleMembership
  className?: string
}

export function CircleStatsCard({ circle, membership, className = '' }: CircleStatsCardProps) {
  const isOwner = membership?.role === 'owner'
  const isAdmin = membership?.role === 'admin'

  return (
    <div className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{circle.avatar}</div>
          <div>
            <h3 className="text-xl font-bold">{circle.name}</h3>
            <p className="text-blue-100">{CIRCLE_TYPES[circle.type].label}</p>
          </div>
        </div>
        {(isOwner || isAdmin) && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-full">
            {isOwner ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            <span className="text-sm font-medium">{isOwner ? '圈主' : '管理员'}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{circle.memberCount}</div>
          <div className="text-sm text-blue-100">总成员</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{circle.stats.activeMembers}</div>
          <div className="text-sm text-blue-100">活跃成员</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{circle.stats.totalMatches}</div>
          <div className="text-sm text-blue-100">总比赛</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{circle.stats.eventsCount}</div>
          <div className="text-sm text-blue-100">活动数</div>
        </div>
      </div>

      {membership && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-sm text-blue-100">
            你于 {new Date(membership.joinedAt).toLocaleDateString()} 加入此圈子
            {membership.circleProfile.nickname && (
              <span className="block mt-1">圈内昵称: {membership.circleProfile.nickname}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}