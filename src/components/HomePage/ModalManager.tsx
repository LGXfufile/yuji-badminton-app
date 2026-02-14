'use client'

import React from 'react'
import RecordMatchModal from '@/components/RecordMatchModal'
import StatsModal from '@/components/StatsModal'
import GoalModal from '@/components/GoalModal'
import ShareModal from '@/components/ShareModal'
import ProfileModal from '@/components/ProfileModal'
import RankingModal from '@/components/RankingModal'
import AchievementModal from '@/components/AchievementModal'
import CircleManagementModal from '@/components/CircleManagementModal'
import AdminDashboard from '@/components/AdminDashboard'

interface ModalManagerProps {
  recordModalOpen: boolean
  setRecordModalOpen: (open: boolean) => void
  statsModalOpen: boolean
  setStatsModalOpen: (open: boolean) => void
  goalModalOpen: boolean
  setGoalModalOpen: (open: boolean) => void
  shareModalOpen: boolean
  setShareModalOpen: (open: boolean) => void
  profileModalOpen: boolean
  setProfileModalOpen: (open: boolean) => void
  rankingModalOpen: boolean
  setRankingModalOpen: (open: boolean) => void
  achievementModalOpen: boolean
  setAchievementModalOpen: (open: boolean) => void
  circleModalOpen: boolean
  setCircleModalOpen: (open: boolean) => void
  adminDashboardOpen: boolean
  setAdminDashboardOpen: (open: boolean) => void
}

export default function ModalManager({
  recordModalOpen,
  setRecordModalOpen,
  statsModalOpen,
  setStatsModalOpen,
  goalModalOpen,
  setGoalModalOpen,
  shareModalOpen,
  setShareModalOpen,
  profileModalOpen,
  setProfileModalOpen,
  rankingModalOpen,
  setRankingModalOpen,
  achievementModalOpen,
  setAchievementModalOpen,
  circleModalOpen,
  setCircleModalOpen,
  adminDashboardOpen,
  setAdminDashboardOpen
}: ModalManagerProps) {
  return (
    <>
      <RecordMatchModal 
        isOpen={recordModalOpen} 
        onClose={() => setRecordModalOpen(false)} 
      />
      <StatsModal 
        isOpen={statsModalOpen} 
        onClose={() => setStatsModalOpen(false)} 
      />
      <GoalModal 
        isOpen={goalModalOpen} 
        onClose={() => setGoalModalOpen(false)} 
      />
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
      />
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
      <RankingModal 
        isOpen={rankingModalOpen} 
        onClose={() => setRankingModalOpen(false)} 
      />
      <AchievementModal 
        isOpen={achievementModalOpen} 
        onClose={() => setAchievementModalOpen(false)} 
      />
      <CircleManagementModal 
        isOpen={circleModalOpen} 
        onClose={() => setCircleModalOpen(false)} 
      />
      <AdminDashboard 
        isOpen={adminDashboardOpen} 
        onClose={() => setAdminDashboardOpen(false)} 
      />
    </>
  )
}