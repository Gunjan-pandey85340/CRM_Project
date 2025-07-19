import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Crown, ChevronDown, ChevronUp, Search } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqData: FAQItem[] = [
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I create an account?',
      answer: 'To create an account, click the "Sign Up" button in the top right corner of the homepage. Fill in your email, password, and full name, then click "Create Account". You\'ll be automatically logged in and redirected to your dashboard.'
    },
    {
      id: '2',
      category: 'Getting Started',
      question: 'What is the admin account?',
      answer: 'The admin account (gunjanpandey8979@gmail.com) has special privileges including viewing all users, managing all tickets, and accessing analytics. Regular users can only manage their own data.'
    },
    {
      id: '3',
      category: 'Tickets',
      question: 'How do I create a support ticket?',
      answer: 'Navigate to "My Tickets" from the main menu, then click "New Ticket". Fill in the title, description, category, and priority level. Your ticket will be submitted to our support team for review.'
    },
    {
      id: '4',
      category: 'Tickets',
      question: 'What are the different ticket statuses?',
      answer: 'Tickets have three statuses: "Open" (newly created), "In Progress" (being worked on by support), and "Resolved" (completed). You can track your ticket status in the My Tickets section.'
    },
    {
      id: '5',
      category: 'Tickets',
      question: 'How long does it take to get a response?',
      answer: 'We aim to respond to all tickets within 24 hours during business days. High priority tickets are typically addressed faster. You\'ll receive email notifications when your ticket status changes.'
    },
    {
      id: '6',
      category: 'Account',
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile page from the main menu. Click the "Edit" button to modify your name, phone number, and company information. Your email address cannot be changed for security reasons.'
    },
    {
      id: '7',
      category: 'Account',
      question: 'Can I change my password?',
      answer: 'Currently, password changes are handled through the forgot password flow. If you need to change your password, please contact support or use the password reset option on the login page.'
    },
    {
      id: '8',
      category: 'Features',
      question: 'What is the feedback system?',
      answer: 'The feedback system allows you to share your thoughts about RoyalCRM. You can rate your experience (1-5 stars) and provide detailed comments. This helps us improve the platform based on user input.'
    },
    {
      id: '9',
      category: 'Features',
      question: 'Does RoyalCRM support dark mode?',
      answer: 'Yes! RoyalCRM automatically detects your system preference for light or dark mode. You can also manually toggle between themes using the sun/moon icon in the header.'
    },
    {
      id: '10',
      category: 'Technical',
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security including encryption, row-level security policies, and secure authentication. Your data is stored securely and only accessible to you and authorized admin users.'
    },
    {
      id: '11',
      category: 'Technical',
      question: 'What browsers are supported?',
      answer: 'RoyalCRM works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.'
    },
    {
      id: '12',
      category: 'Billing',
      question: 'Is RoyalCRM free to use?',
      answer: 'RoyalCRM offers a free tier with basic features. Premium features and advanced analytics may require a subscription. Contact our sales team for enterprise pricing options.'
    }
  ]

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))]

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="h-12 w-12 text-royal-600 mr-4" />
            <Crown className="h-12 w-12 text-royal-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about RoyalCRM
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 text-center">
                <HelpCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No FAQs Found
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Try adjusting your search terms or category filter.
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredFAQs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="px-2 py-1 text-xs font-medium bg-royal-100 text-royal-800 dark:bg-royal-900 dark:text-royal-200 rounded-full mr-3">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                          {item.question}
                        </h3>
                      </div>
                      <div className="ml-4">
                        {openItems.includes(item.id) ? (
                          <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
                          <div className="pt-4">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Still Have Questions?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center">
                  <span className="font-medium text-slate-900 dark:text-white">Email:</span>
                  <span className="ml-2 text-royal-600 dark:text-royal-400">support@royalcrm.com</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium text-slate-900 dark:text-white">Phone:</span>
                  <span className="ml-2 text-royal-600 dark:text-royal-400">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQ