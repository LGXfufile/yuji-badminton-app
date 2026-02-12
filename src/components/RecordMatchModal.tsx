'use client'

import React, { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { useMatchStore } from '@/stores'
import { Match } from '@/types'

interface RecordMatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RecordMatchModal({ isOpen, onClose }: RecordMatchModalProps) {
  const { saveMatch, loading } = useMatchStore()
  
  const [formData, setFormData] = useState({
    type: 'singles' as 'singles' | 'doubles' | 'mixed',
    venue: '',
    duration: 30,
    notes: '',
    teamAScore: 0,
    teamBScore: 0,
    teamAPlayers: [''],
    teamBPlayers: [''],
    tags: [] as string[]
  })

  const [newTag, setNewTag] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const matchData: Omit<Match, '_id' | 'createdAt'> = {
      type: formData.type,
      players: {
        teamA: formData.teamAPlayers.filter(p => p.trim()),
        teamB: formData.teamBPlayers.filter(p => p.trim())
      },
      score: {
        teamA: formData.teamAScore,
        teamB: formData.teamBScore
      },
      winner: formData.teamAScore > formData.teamBScore ? 'teamA' : 'teamB',
      duration: formData.duration,
      venue: formData.venue,
      date: new Date(),
      notes: formData.notes,
      tags: formData.tags,
      media: {
        photos: [],
        videos: []
      },
      createdBy: 'mock_user_id',
      confirmedBy: []
    }

    await saveMatch(matchData)
    onClose()
    
    // 重置表单
    setFormData({
      type: 'singles',
      venue: '',
      duration: 30,
      notes: '',
      teamAScore: 0,
      teamBScore: 0,
      teamAPlayers: [''],
      teamBPlayers: [''],
      tags: []
    })
  }

  const addPlayer = (team: 'A' | 'B') => {
    if (team === 'A') {
      setFormData(prev => ({
        ...prev,
        teamAPlayers: [...prev.teamAPlayers, '']
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        teamBPlayers: [...prev.teamBPlayers, '']
      }))
    }
  }

  const removePlayer = (team: 'A' | 'B', index: number) => {
    if (team === 'A') {
      setFormData(prev => ({
        ...prev,
        teamAPlayers: prev.teamAPlayers.filter((_, i) => i !== index)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        teamBPlayers: prev.teamBPlayers.filter((_, i) => i !== index)
      }))
    }
  }

  const updatePlayer = (team: 'A' | 'B', index: number, value: string) => {
    if (team === 'A') {
      setFormData(prev => ({
        ...prev,
        teamAPlayers: prev.teamAPlayers.map((p, i) => i === index ? value : p)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        teamBPlayers: prev.teamBPlayers.map((p, i) => i === index ? value : p)
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">记录比赛</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 比赛类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">比赛类型</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'singles', label: '单打' },
                { value: 'doubles', label: '双打' },
                { value: 'mixed', label: '混双' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                  className={`p-3 rounded-xl border-2 font-medium transition-all ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 比分 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">比分</label>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">我方</div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, teamAScore: Math.max(0, prev.teamAScore - 1) }))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-3xl font-bold text-blue-600 w-16 text-center">
                    {formData.teamAScore}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, teamAScore: prev.teamAScore + 1 }))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-gray-400">:</div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">对方</div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, teamBScore: Math.max(0, prev.teamBScore - 1) }))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-3xl font-bold text-red-600 w-16 text-center">
                    {formData.teamBScore}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, teamBScore: prev.teamBScore + 1 }))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 参赛选手 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 我方选手 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">我方选手</label>
              <div className="space-y-2">
                {formData.teamAPlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayer('A', index, e.target.value)}
                      placeholder={`选手 ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.teamAPlayers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlayer('A', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.type !== 'singles' && formData.teamAPlayers.length < 2 && (
                  <button
                    type="button"
                    onClick={() => addPlayer('A')}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600"
                  >
                    + 添加选手
                  </button>
                )}
              </div>
            </div>

            {/* 对方选手 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">对方选手</label>
              <div className="space-y-2">
                {formData.teamBPlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayer('B', index, e.target.value)}
                      placeholder={`对手 ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.teamBPlayers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlayer('B', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.type !== 'singles' && formData.teamBPlayers.length < 2 && (
                  <button
                    type="button"
                    onClick={() => addPlayer('B')}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600"
                  >
                    + 添加对手
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 场地和时长 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">比赛场地</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                placeholder="请输入场地名称"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">比赛时长（分钟）</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="添加标签"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                添加
              </button>
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">比赛备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="记录比赛心得、技术要点等..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !formData.venue}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '保存比赛'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}