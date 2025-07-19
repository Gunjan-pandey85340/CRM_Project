import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(['low', 'medium', 'high'])
})

type TicketForm = z.infer<typeof ticketSchema>

const categories = [
  'Technical Support',
  'Billing',
  'Feature Request',
  'Bug Report',
  'Account Issues',
  'General Inquiry',
  'Other'
]

const NewTicket: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'medium'
    }
  })

  const onSubmit = async (data: TicketForm) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          user_id: user.id,
          status: 'open'
        })

      if (error) throw error

      toast.success('Ticket created successfully!')
      navigate('/tickets')
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Failed to create ticket')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Ticket className="h-8 w-8 text-royal-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create New Ticket
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Submit a support request and we'll get back to you as soon as possible
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="Brief description of your issue"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['low', 'medium', 'high'] as const).map(priority => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="radio"
                        {...register('priority')}
                        value={priority}
                        className="sr-only"
                      />
                      <div className={`w-full p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                        priority === 'low' 
                          ? 'border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300'
                          : priority === 'medium'
                          ? 'border-orange-300 hover:border-orange-400 text-orange-700 dark:text-orange-300'
                          : 'border-red-300 hover:border-red-400 text-red-700 dark:text-red-300'
                      }`}>
                        <span className="font-medium capitalize">{priority}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• Your ticket will be reviewed by our support team</li>
                  <li>• You'll receive updates via email as we work on your request</li>
                  <li>• You can track progress in your tickets dashboard</li>
                  <li>• Average response time is 24 hours for standard requests</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/tickets')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default NewTicket