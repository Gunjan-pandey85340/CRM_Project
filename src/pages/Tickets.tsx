import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDateTime, getStatusColor, getPriorityColor } from '../lib/utils'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

interface TicketData {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  category: string
  created_at: string
  updated_at: string
}

const Tickets: React.FC = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user])

  const fetchTickets = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tickets:', error.message)
        throw error
      }
      
      setTickets(data || [])
    } catch (error: any) {
      console.error('Error fetching tickets:', error)
      setError(error.message || 'Failed to load tickets. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Ticket className="h-4 w-4" />
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Error Loading Tickets
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {error}
            </p>
            <Button onClick={fetchTickets}>
              Try Again
            </Button>
          </Card>
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
                My Tickets
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Track and manage your support requests
              </p>
            </div>
            <Link to="/tickets/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
                <Ticket className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Open</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
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
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">In Progress</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Resolved</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </Card>
        </motion.div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-12 text-center">
              <Ticket className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your filters'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {tickets.length === 0 
                  ? 'Create your first support ticket to get started'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {tickets.length === 0 && (
                <Link to="/tickets/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Ticket
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getStatusIcon(ticket.status)}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white ml-2">
                          {ticket.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>Category: {ticket.category}</span>
                        <span>Created: {formatDateTime(ticket.created_at)}</span>
                        {ticket.updated_at !== ticket.created_at && (
                          <span>Updated: {formatDateTime(ticket.updated_at)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tickets