import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Ticket, MessageSquare, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface DashboardStats {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  pendingTickets: number
}

interface RecentTicket {
  id: string
  title: string
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
  priority: 'low' | 'medium' | 'high'
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0
  })
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch ticket statistics
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('status')
        .eq('user_id', user.id)

      if (error) throw error

      const stats = {
        totalTickets: tickets?.length || 0,
        openTickets: tickets?.filter(t => t.status === 'open').length || 0,
        resolvedTickets: tickets?.filter(t => t.status === 'resolved').length || 0,
        pendingTickets: tickets?.filter(t => t.status === 'in_progress').length || 0
      }

      setStats(stats)

      // Fetch recent tickets
      const { data: recent, error: recentError } = await supabase
        .from('tickets')
        .select('id, title, status, created_at, priority')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentError) throw recentError

      setRecentTickets(recent || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'In Progress',
      value: stats.pendingTickets,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Resolved',
      value: stats.resolvedTickets,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back!
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/tickets/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tickets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Recent Tickets
                </h2>
                <Link to="/tickets">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {recentTickets.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    No tickets yet
                  </p>
                  <Link to="/tickets/new">
                    <Button size="sm">
                      Create Your First Ticket
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                          {ticket.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {formatDate(ticket.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/tickets/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Ticket
                  </Button>
                </Link>
                <Link to="/tickets" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Ticket className="h-4 w-4 mr-2" />
                    View All Tickets
                  </Button>
                </Link>
                <Link to="/feedback" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Welcome Message */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
              <div className="text-center">
                <Crown className="h-8 w-8 text-royal-600 dark:text-royal-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Welcome to RoyalCRM!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Need help getting started? Check out our documentation or contact support.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard