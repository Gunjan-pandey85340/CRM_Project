import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Tickets from './pages/Tickets'
import NewTicket from './pages/NewTicket'
import Feedback from './pages/Feedback'
import AdminDashboard from './pages/AdminDashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import FAQ from './pages/FAQ'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute>
                      <Tickets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets/new"
                  element={
                    <ProtectedRoute>
                      <NewTicket />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />
                
                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)'
                }
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App