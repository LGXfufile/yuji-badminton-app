'use client'

import React from 'react'
import { Users } from 'lucide-react'
import { Circle } from '@/types/privacy'

interface CircleSectionProps {
  myCircles: Circle[]
  onManageCircles: () => void
}

export default function CircleSection({ 
  myCircles, 
  onManageCircles 
}: CircleSectionProps) {
  if (myCircles.length === 0) {
    return null
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">我的圈子</h3>
        </div>
        <button
          onClick={onManageCircles}
          className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 text-sm font-medium"
        >
          管理圈子
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myCircles.slice(0, 3).map((circle) => (
          <div key={circle.id} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200/30">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">{circle.avatar}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{circle.name}</h4>
                <p className="text-sm text-gray-600">{circle.memberCount} 成员</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{circle.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}