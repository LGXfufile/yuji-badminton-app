'use client'

import React, { useState, useRef } from 'react'
import { X, Camera, Upload, User, Check } from 'lucide-react'
import { useUserStore } from '@/stores'

interface AvatarUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AvatarUploadModal({ isOpen, onClose }: AvatarUploadModalProps) {
  const { user, setUser } = useUserStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // 预设头像选项
  const presetAvatars = [
    '/images/avatars/badminton-1.svg',
    '/images/avatars/badminton-2.svg', 
    '/images/avatars/badminton-3.svg',
    '/images/avatars/badminton-4.svg',
    '/images/avatars/sport-1.svg',
    '/images/avatars/sport-2.svg',
    '/images/avatars/sport-3.svg',
    '/images/avatars/sport-4.svg'
  ]

  // 模拟微信头像获取
  const getWechatAvatar = async () => {
    setUploading(true)
    try {
      // 在真实微信小程序环境中，这里会调用微信API
      // wx.getUserProfile() 或 wx.chooseAvatar()
      
      // 模拟获取微信头像
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟微信头像URL
      const mockWechatAvatar = `https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQJjKwPiblL7DjVmR${Date.now()}/132`
      setSelectedImage(mockWechatAvatar)
      
    } catch (error) {
      console.error('获取微信头像失败:', error)
      alert('获取微信头像失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小 (限制5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }

    // 读取文件并预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // 选择预设头像
  const selectPresetAvatar = (avatarUrl: string) => {
    setSelectedImage(avatarUrl)
  }

  // 保存头像
  const saveAvatar = async () => {
    if (!selectedImage || !user) return

    setUploading(true)
    try {
      // 在真实环境中，这里会上传图片到服务器
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 更新用户头像
      const updatedUser = {
        ...user,
        avatarUrl: selectedImage
      }
      setUser(updatedUser)

      // 保存到本地存储
      localStorage.setItem('userAvatar', selectedImage)
      
      alert('头像更新成功！')
      onClose()
    } catch (error) {
      console.error('头像上传失败:', error)
      alert('头像上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">更换头像</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 当前头像预览 */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <img
                src={selectedImage || user?.avatarUrl || '/images/default-avatar.svg'}
                alt="头像预览"
                className="w-full h-full rounded-full border-4 border-gray-200 object-cover"
              />
              {selectedImage && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {selectedImage ? '新头像预览' : '当前头像'}
            </p>
          </div>

          {/* 获取微信头像 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">微信头像</h3>
            <button
              onClick={getWechatAvatar}
              disabled={uploading}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>获取中...</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>使用微信头像</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              点击获取你的微信头像作为羽迹头像
            </p>
          </div>

          {/* 上传自定义头像 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">上传头像</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <Upload className="w-5 h-5" />
              <span>从相册选择</span>
            </button>
            <p className="text-xs text-gray-500 text-center">
              支持 JPG、PNG 格式，文件大小不超过 5MB
            </p>
          </div>

          {/* 预设头像 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">预设头像</h3>
            <div className="grid grid-cols-4 gap-3">
              {presetAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => selectPresetAvatar(avatar)}
                  className={`w-16 h-16 rounded-full border-3 transition-all hover:scale-105 ${
                    selectedImage === avatar
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`预设头像 ${index + 1}`}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      // 如果预设头像加载失败，使用默认头像
                      (e.target as HTMLImageElement).src = '/images/default-avatar.svg'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 拍照功能 (移动端) */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">拍照</h3>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileUpload}
              className="hidden"
              id="camera-input"
            />
            <label
              htmlFor="camera-input"
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>拍照上传</span>
            </label>
            <p className="text-xs text-gray-500 text-center">
              使用前置摄像头拍摄头像
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              取消
            </button>
            <button
              onClick={saveAvatar}
              disabled={!selectedImage || uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>保存中...</span>
                </>
              ) : (
                <span>保存头像</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}