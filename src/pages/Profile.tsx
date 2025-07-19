import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Building, Save, Edit, Calendar, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal(''))
})

type ProfileForm = z.infer<typeof profileSchema>

interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  company: string | null
  created_at: string
  updated_at: string
}

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setError(null)
      setLoading(true)
      
      // First try to get existing profile
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        const defaultName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            full_name: defaultName,
            phone: null,
            company: null
          })
          .select()
          .single()

        if (createError) {
          throw createError
        }
        
        data = newProfile
      } else if (error) {
        throw error
      }

      if (data) {
        setProfile(data)
        reset({
          full_name: data.full_name || '',
          phone: data.phone || '',
          company: data.company || ''
        })
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError(error.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return

    try {
      setError(null)
      
      const updateData = {
        user_id: user.id,
        full_name: data.full_name,
        phone: data.phone || null,
        company: data.company || null,
        updated_at: new Date().toISOString()
      }

      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .upsert(updateData, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setProfile(updatedProfile)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-600"></div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Profile Error
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {error}
            </p>
            <Button onClick={fetchProfile}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your personal information and account settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Personal Information
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    {...register('full_name')}
                    error={errors.full_name?.message}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    {...register('phone')}
                    error={errors.phone?.message}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                  <Input
                    label="Company"
                    {...register('company')}
                    error={errors.company?.message}
                    disabled={!isEditing}
                    placeholder="Enter your company name"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </motion.div>

          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-royal-600 dark:text-royal-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {profile?.full_name || 'User'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {user?.email}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-slate-400 mr-3" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {user?.email}
                  </span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-slate-400 mr-3" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {profile.phone}
                    </span>
                  </div>
                )}
                {profile?.company && (
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 text-slate-400 mr-3" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {profile.company}
                    </span>
                  </div>
                )}
                {profile?.created_at && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-slate-400 mr-3" />
                    <span className="text-slate-600 dark:text-slate-300">
                      Joined {formatDate(profile.created_at)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Account Status
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Your account is active and verified.
              </p>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile