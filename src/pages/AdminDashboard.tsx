import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Ticket, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Star,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Activity,
  Database,
  Wifi,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDateTime, getStatusColor, getPriorityColor } from '../lib/utils'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  company: string | null
  created_at: string
  email?: string
}

interface TicketData {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  category: string
  user_id: string
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
}

interface FeedbackData {
  id: string
  title: string
  message: string
  rating: number
  user_id: string
  created_at: string
  user_name?: string
  user_email?: string
}

interface DashboardStats {
  totalUsers: number
  totalTickets: number
  totalFeedback: number
  openTickets: number
  resolvedTickets: number
  avgRating: number
  weeklyGrowth: {
    users: number
    tickets: number
    feedback: number
  }
}

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTickets: 0,
    totalFeedback: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgRating: 0,
    weeklyGrowth: { users: 0, tickets: 0, feedback: 0 }
  })
  
  const [users, setUsers] = useState<UserProfile[]>([])
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [feedback, setFeedback] = useState<FeedbackData[]>([])
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  
  // Modals
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null)

  useEffect(() => {
    if (isAdmin) {
      fetchAllData()
    }
  }, [isAdmin])

  const fetchAllData = async () => {
    console.log('🔄 Starting to fetch ALL admin data...')
    setLoading(true)
    
    try {
      await Promise.all([
        fetchUsers(),
        fetchTickets(),
        fetchFeedback()
      ])
      
      console.log('✅ All admin data fetched successfully')
    } catch (error) {
      console.error('❌ Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      console.log('👥 Fetching ALL users...')
      
      // Get all user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('❌ Error fetching user profiles:', profilesError)
        throw profilesError
      }

      console.log('📊 User profiles fetched:', profilesData?.length || 0)

      // Get all auth users to get email addresses
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.warn('⚠️ Could not fetch auth users:', authError)
      }

      // Combine profile data with auth data
      const usersWithEmails = (profilesData || []).map(profile => ({
        ...profile,
        email: authData?.users?.find(authUser => authUser.id === profile.user_id)?.email || 'Unknown'
      }))

      console.log('✅ Users with emails:', usersWithEmails.length)
      setUsers(usersWithEmails)
      
      return usersWithEmails
    } catch (error) {
      console.error('❌ Error in fetchUsers:', error)
      throw new Error('Failed to fetch users')
    }
  }

  const fetchTickets = async () => {
    try {
      console.log('🎫 Fetching ALL tickets from ALL users...')
      
      // Get ALL tickets without any user filtering
      const { data: allTicketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (ticketsError) {
        console.error('❌ Error fetching tickets:', ticketsError)
        throw ticketsError
      }

      console.log('📊 Raw tickets data:', allTicketsData?.length || 0)
      console.log('🔍 Sample ticket:', allTicketsData?.[0])

      if (!allTicketsData || allTicketsData.length === 0) {
        console.log('📝 No tickets found in database')
        setTickets([])
        return []
      }

      // Get unique user IDs from tickets
      const userIds = [...new Set(allTicketsData.map(ticket => ticket.user_id))]
      console.log('👤 Unique user IDs in tickets:', userIds)

      // Get user profiles for these users
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name')
        .in('user_id', userIds)

      if (profileError) {
        console.warn('⚠️ Error fetching user profiles for tickets:', profileError)
      }

      console.log('👥 User profiles for tickets:', userProfiles?.length || 0)

      // Get auth users for email addresses
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.warn('⚠️ Could not fetch auth users for tickets:', authError)
      }

      // Combine tickets with user information
      const ticketsWithUsers = allTicketsData.map(ticket => {
        const userProfile = userProfiles?.find(profile => profile.user_id === ticket.user_id)
        const authUser = authData?.users?.find(authUser => authUser.id === ticket.user_id)
        
        return {
          ...ticket,
          user_name: userProfile?.full_name || 'Unknown User',
          user_email: authUser?.email || 'Unknown Email'
        }
      })

      console.log('✅ Tickets with user info:', ticketsWithUsers.length)
      console.log('🔍 Sample ticket with user:', ticketsWithUsers[0])
      
      setTickets(ticketsWithUsers)
      return ticketsWithUsers
    } catch (error) {
      console.error('❌ Error in fetchTickets:', error)
      throw new Error('Failed to fetch tickets')
    }
  }

  const fetchFeedback = async () => {
    try {
      console.log('💬 Fetching ALL feedback from ALL users...')
      
      // Get ALL feedback without any user filtering
      const { data: allFeedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (feedbackError) {
        console.error('❌ Error fetching feedback:', feedbackError)
        throw feedbackError
      }

      console.log('📊 Raw feedback data:', allFeedbackData?.length || 0)
      console.log('🔍 Sample feedback:', allFeedbackData?.[0])

      if (!allFeedbackData || allFeedbackData.length === 0) {
        console.log('📝 No feedback found in database')
        setFeedback([])
        return []
      }

      // Get unique user IDs from feedback
      const userIds = [...new Set(allFeedbackData.map(fb => fb.user_id))]
      console.log('👤 Unique user IDs in feedback:', userIds)

      // Get user profiles for these users
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name')
        .in('user_id', userIds)

      if (profileError) {
        console.warn('⚠️ Error fetching user profiles for feedback:', profileError)
      }

      console.log('👥 User profiles for feedback:', userProfiles?.length || 0)

      // Get auth users for email addresses
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.warn('⚠️ Could not fetch auth users for feedback:', authError)
      }

      // Combine feedback with user information
      const feedbackWithUsers = allFeedbackData.map(fb => {
        const userProfile = userProfiles?.find(profile => profile.user_id === fb.user_id)
        const authUser = authData?.users?.find(authUser => authUser.id === fb.user_id)
        
        return {
          ...fb,
          user_name: userProfile?.full_name || 'Unknown User',
          user_email: authUser?.email || 'Unknown Email'
        }
      })

      console.log('✅ Feedback with user info:', feedbackWithUsers.length)
      console.log('🔍 Sample feedback with user:', feedbackWithUsers[0])
      
      setFeedback(feedbackWithUsers)
      return feedbackWithUsers
    } catch (error) {
      console.error('❌ Error in fetchFeedback:', error)
      throw new Error('Failed to fetch feedback')
    }
  }

  // Calculate stats whenever data changes
  useEffect(() => {
    const totalUsers = users.length
    const totalTickets = tickets.length
    const totalFeedback = feedback.length
    const openTickets = tickets.filter(t => t.status === 'open').length
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length
    const avgRating = feedback.length > 0 
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
      : 0

    // Calculate weekly growth (simplified)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weeklyUsers = users.filter(u => new Date(u.created_at) > weekAgo).length
    const weeklyTickets = tickets.filter(t => new Date(t.created_at) > weekAgo).length
    const weeklyFeedback = feedback.filter(f => new Date(f.created_at) > weekAgo).length

    setStats({
      totalUsers,
      totalTickets,
      totalFeedback,
      openTickets,
      resolvedTickets,
      avgRating,
      weeklyGrowth: {
        users: weeklyUsers,
        tickets: weeklyTickets,
        feedback: weeklyFeedback
      }
    })

    console.log('📈 Updated stats:', {
      totalUsers,
      totalTickets,
      totalFeedback,
      openTickets,
      resolvedTickets,
      avgRating: avgRating.toFixed(1)
    })
  }, [users, tickets, feedback])

  const updateTicketStatus = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ticketId)

      if (error) throw error

      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
          : ticket
      ))

      toast.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      console.error('Error updating ticket status:', error)
      toast.error('Failed to update ticket status')
    }
  }

  const deleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId)

      if (error) throw error

      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId))
      toast.success('Ticket deleted successfully')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast.error('Failed to delete ticket')
    }
  }

  const deleteFeedback = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId)

      if (error) throw error

      setFeedback(prev => prev.filter(fb => fb.id !== feedbackId))
      toast.success('Feedback deleted successfully')
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast.error('Failed to delete feedback')
    }
  }

  const exportData = (data: any[], filename: string) => {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${filename} exported successfully`)
  }

  // Filter functions
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const filteredFeedback = feedback.filter(fb => {
    const matchesSearch = fb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fb.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (fb.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === 'all' || fb.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading admin dashboard...</p>
        </div>
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
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage users, tickets, and feedback across the platform
              </p>
            </div>
            <Button onClick={fetchAllData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    +{stats.weeklyGrowth.users} this week
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Tickets</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalTickets}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    +{stats.weeklyGrowth.tickets} this week
                  </p>
                </div>
                <Ticket className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Platform Health</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">98ms</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">99.9% uptime</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.avgRating.toFixed(1)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avg Rating</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'tickets', label: 'Tickets', icon: Ticket },
                { id: 'feedback', label: 'Feedback', icon: MessageSquare }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-royal-500 text-royal-600 dark:text-royal-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Open Tickets</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.openTickets}</p>
                  </div>
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Feedback</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalFeedback}</p>
                  </div>
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Satisfaction</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[...tickets.slice(0, 3), ...feedback.slice(0, 2)]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      {'status' in item ? (
                        <Ticket className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {'status' in item ? 'New Ticket' : 'New Feedback'}: {item.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          by {item.user_name} • {formatDateTime(item.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                {tickets.length === 0 && feedback.length === 0 && (
                  <p className="text-slate-600 dark:text-slate-300 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => exportData(users, 'users')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>

            {/* Users List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {user.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {user.email}
                        </p>
                        {user.company && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            {user.company}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Joined {formatDateTime(user.created_at)}
                        </p>
                      </div>
                      <Button
                        onClick={() => setSelectedUser(user)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {users.length === 0 ? 'No users have registered yet.' : 'Try adjusting your search criteria.'}
                </p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <Button
                  onClick={() => exportData(filteredTickets, 'tickets')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mr-3">
                            {ticket.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>By: {ticket.user_name} ({ticket.user_email})</span>
                          <span>Category: {ticket.category}</span>
                          <span>Created: {formatDateTime(ticket.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => setSelectedTicket(ticket)}
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <select
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                          className="text-xs px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <Button
                          onClick={() => deleteTicket(ticket.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <Card className="p-12 text-center">
                <Ticket className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No tickets found
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {tickets.length === 0 ? 'No tickets have been created yet.' : 'Try adjusting your search or filter criteria.'}
                </p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <Button
                  onClick={() => exportData(filteredFeedback, 'feedback')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.map((fb, index) => (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mr-3">
                            {fb.title}
                          </h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < fb.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                              ({fb.rating}/5)
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-3">
                          {fb.message}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>By: {fb.user_name} ({fb.user_email})</span>
                          <span>Submitted: {formatDateTime(fb.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => setSelectedFeedback(fb)}
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteFeedback(fb.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredFeedback.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No feedback found
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feedback.length === 0 ? 'No feedback has been submitted yet.' : 'Try adjusting your search or filter criteria.'}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Modals */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Details"
          className="max-w-2xl"
        >
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedUser.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedUser.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Company
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedUser.company || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Joined
                  </label>
                  <p className="text-slate-900 dark:text-white">{formatDateTime(selectedUser.created_at)}</p>
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Activity Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {tickets.filter(t => t.user_id === selectedUser.user_id).length}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Tickets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {feedback.filter(f => f.user_id === selectedUser.user_id).length}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Feedback</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {feedback.filter(f => f.user_id === selectedUser.user_id).length > 0
                        ? (feedback.filter(f => f.user_id === selectedUser.user_id)
                            .reduce((sum, f) => sum + f.rating, 0) / 
                           feedback.filter(f => f.user_id === selectedUser.user_id).length).toFixed(1)
                        : '0.0'
                      }
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title="Ticket Details"
          className="max-w-3xl"
        >
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedTicket.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    User
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedTicket.user_name} ({selectedTicket.user_email})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedTicket.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Created
                  </label>
                  <p className="text-slate-900 dark:text-white">{formatDateTime(selectedTicket.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Updated
                  </label>
                  <p className="text-slate-900 dark:text-white">{formatDateTime(selectedTicket.updated_at)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    updateTicketStatus(selectedTicket.id, e.target.value as any)
                    setSelectedTicket({ ...selectedTicket, status: e.target.value as any })
                  }}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={!!selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          title="Feedback Details"
          className="max-w-2xl"
        >
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedFeedback.title}
                </h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < selectedFeedback.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-slate-600 dark:text-slate-300">
                    ({selectedFeedback.rating}/5)
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    User
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedFeedback.user_name} ({selectedFeedback.user_email})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Submitted
                  </label>
                  <p className="text-slate-900 dark:text-white">{formatDateTime(selectedFeedback.created_at)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default AdminDashboard