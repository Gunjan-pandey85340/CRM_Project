import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDateTime } from '../lib/utils'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const feedbackSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  rating: z.number().min(1).max(5)
})

type FeedbackForm = z.infer<typeof feedbackSchema>

interface FeedbackData {
  id: string
  title: string
  message: string
  rating: number
  created_at: string
}

const Feedback: React.FC = () => {
  const { user } = useAuth()
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRating, setSelectedRating] = useState(5)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5
    }
  })

  useEffect(() => {
    if (user) {
      fetchFeedbacks()
    }
  }, [user])

  const fetchFeedbacks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FeedbackForm) => {
    if (!user) return

    try {
      console.log('Submitting feedback:', { 
        title: data.title,
        message: data.message,
        rating: selectedRating, 
        user_id: user.id 
      })
      
      const { error } = await supabase
        .from('feedback')
        .insert({
          title: data.title,
          message: data.message,
          rating: selectedRating,
          user_id: user.id
        })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Feedback submitted successfully to database')

      toast.success('Feedback submitted successfully!')
      reset()
      setSelectedRating(5)
      await fetchFeedbacks()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      toast.error('Failed to submit feedback')
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => setSelectedRating(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="h-8 w-8 text-royal-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Feedback
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Share your thoughts and help us improve RoyalCRM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Submit Feedback
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="Brief summary of your feedback"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {renderStars(selectedRating, true)}
                    <span className="text-sm text-slate-600 dark:text-slate-300 ml-2">
                      ({selectedRating} out of 5)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="Tell us about your experience with RoyalCRM. What do you like? What could be improved?"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Previous Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Your Previous Feedback
              </h2>

              {feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-300">
                    No feedback submitted yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {feedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {feedback.title}
                        </h3>
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                        {feedback.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(feedback.created_at)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Feedback Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Feedback Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  What to include:
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• Specific features you love or find challenging</li>
                  <li>• Suggestions for improvements</li>
                  <li>• Your overall experience with the platform</li>
                  <li>• Any bugs or issues you've encountered</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  How we use your feedback:
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• Prioritize new features and improvements</li>
                  <li>• Fix bugs and usability issues</li>
                  <li>• Enhance user experience</li>
                  <li>• Guide product development decisions</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Feedback