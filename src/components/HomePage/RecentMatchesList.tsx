'use client'

import React from 'react'
import { Match } from '@/types'
import dayjs from 'dayjs'

interface RecentMatchesListProps {
  recentMatches: Match[]
}

export default function RecentMatchesList({ recentMatches }: RecentMatchesListProps) {
  if (recentMatches.length === 0) {
    return null
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">最近比赛</h3>
      <div className="space-y-4">
        {recentMatches.map((match) => (
          <div key={match._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/30">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {match.type === 'singles' ? '单打' : 
                   match.type === 'doubles' ? '双打' : '混双'}
                </span>
                <span className="text-gray-600">{match.venue}</span>
              </div>
              <div className="text-sm text-gray-500">
                {dayjs(match.date).format('YYYY年MM月DD日')}
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold mb-1 ${
                match.winner === 'teamA' ? 'text-green-600' : 'text-red-500'
              }`}>
                {match.score.teamA} : {match.score.teamB}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                match.winner === 'teamA' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {match.winner === 'teamA' ? '胜' : '负'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}