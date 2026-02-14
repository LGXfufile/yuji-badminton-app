'use client'

import React from 'react'

interface QuickAction {
  icon: string
  text: string
  color: string
  onClick: () => void
}

interface QuickActionsGridProps {
  actions: QuickAction[]
}

export default function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">快捷操作</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-center`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="font-semibold">{action.text}</div>
          </button>
        ))}
      </div>
    </div>
  )
}