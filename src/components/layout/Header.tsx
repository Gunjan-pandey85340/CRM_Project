import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Menu, X, Moon, Sun, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../ui/Button'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const publicNavItems = [
    { href: '/', label: 'Home' }
  ]

  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tickets', label: 'My Tickets' },
    { href: '/profile', label: 'Profile' }
  ]

  const adminNavItems = [
    { href: '/admin', label: 'Admin Dashboard' }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-royal-600" />
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              <span className="text-royal-600">CRM</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Public Navigation */}
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-royal-600 dark:text-royal-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Authenticated Navigation */}
            {user && (
              <>
                {userNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'text-royal-600 dark:text-royal-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {isAdmin && adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'text-royal-600 dark:text-royal-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4"
          >
            <div className="flex flex-col space-y-2">
              {/* Public Navigation */}
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Authenticated Navigation */}
              {user && (
                <>
                  {userNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {isAdmin && adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}

              {/* Auth Actions for Mobile */}
              {!user && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-royal-600 dark:hover:text-royal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-sm font-medium text-royal-600 dark:text-royal-400 hover:bg-royal-50 dark:hover:bg-royal-900 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header