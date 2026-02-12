'use client'

import React from 'react'
import { Globe, Users, Lock, Eye, EyeOff } from 'lucide-react'
import { PrivacyLevel, PRIVACY_LEVELS } from '@/types/privacy'

interface PrivacyIndicatorProps {
  level: PrivacyLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showTooltip?: boolean
  className?: string
}

export default function PrivacyIndicator({ 
  level, 
  size = 'md', 
  showLabel = false, 
  showTooltip = true,
  className = '' 
}: PrivacyIndicatorProps) {
  const config = PRIVACY_LEVELS[level]
  
  const sizeClasses = {
    sm: 'w-3 h-3 text-xs',
    md: 'w-4 h-4 text-sm', 
    lg: 'w-5 h-5 text-base'
  }

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const getIcon = () => {
    switch (level) {
      case 'public':
        return <Globe className={iconSizes[size]} />
      case 'circle':
        return <Users className={iconSizes[size]} />
      case 'private':
        return <Lock className={iconSizes[size]} />
      default:
        return <EyeOff className={iconSizes[size]} />
    }
  }

  return (
    <div 
      className={`inline-flex items-center space-x-1 ${className}`}
      title={showTooltip ? `${config.label}: ${config.description}` : undefined}
    >
      <div className={`
        flex items-center justify-center rounded-full
        ${sizeClasses[size]} ${config.bgColor} ${config.color}
        border ${config.borderColor}
      `}>
        {getIcon()}
      </div>
      
      {showLabel && (
        <span className={`font-medium ${config.color} ${sizeClasses[size]}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}

// 隐私级别选择器组件
interface PrivacyLevelSelectorProps {
  value: PrivacyLevel
  onChange: (level: PrivacyLevel) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PrivacyLevelSelector({ 
  value, 
  onChange, 
  disabled = false,
  size = 'md' 
}: PrivacyLevelSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      {Object.entries(PRIVACY_LEVELS).map(([level, config]) => (
        <button
          key={level}
          onClick={() => !disabled && onChange(level as PrivacyLevel)}
          disabled={disabled}
          className={`
            p-2 rounded-xl border-2 transition-all
            ${value === level 
              ? `${config.borderColor} ${config.bgColor}` 
              : 'border-gray-200 hover:border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          title={`${config.label}: ${config.description}`}
        >
          <PrivacyIndicator level={level as PrivacyLevel} size={size} />
        </button>
      ))}
    </div>
  )
}

// 隐私状态卡片组件
interface PrivacyStatusCardProps {
  title: string
  description: string
  level: PrivacyLevel
  onEdit?: () => void
  className?: string
}

export function PrivacyStatusCard({ 
  title, 
  description, 
  level, 
  onEdit,
  className = '' 
}: PrivacyStatusCardProps) {
  const config = PRIVACY_LEVELS[level]
  
  return (
    <div className={`
      p-4 rounded-2xl border-2 transition-all
      ${config.borderColor} ${config.bgColor}
      ${className}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <PrivacyIndicator level={level} showLabel />
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}