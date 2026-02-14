'use client'

import React from 'react'
import { Calendar, TrendingUp, Play } from 'lucide-react'
import { Match } from '@/types'
import dayjs from 'dayjs'

interface TodayStatsSectionProps {
  todayMatches: Match[]
  onQuickRecord: () => void
}

export default function TodayStatsSection({ 
  todayMatches, 
  onQuickRecord 
}: TodayStatsSectionProps) {
  return (
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
          <button 
            onClick={onQuickRecord}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            立即记录
          </button>
        </div>
      )}
    </div>
  )
}