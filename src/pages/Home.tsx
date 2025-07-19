import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Shield, Zap, Users, ArrowRight, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const Home: React.FC = () => {
  const features = [
    {
      icon: Crown,
      title: 'Premium Experience',
      description: 'Elegant, professional interface designed for modern businesses'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time updates and notifications for seamless workflow'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Comprehensive ticket management and user administration'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager',
      company: 'TechCorp',
      rating: 5,
      comment: 'RoyalCRM transformed our customer support workflow. The interface is intuitive and powerful.'
    },
    {
      name: 'Michael Chen',
      role: 'CEO',
      company: 'StartupXYZ',
      rating: 5,
      comment: 'The admin dashboard provides incredible insights. Perfect for scaling our business.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Support Lead',
      company: 'ServicePro',
      rating: 5,
      comment: 'Ticket management has never been easier. The royal theme is simply beautiful.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-royal-900 via-royal-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRhMiAyIDAgMCAxIDQgMGEyIDIgMCAwIDEgNCAwaCA2YTIgMiAwIDAgMSAwIDRoLTZhMiAyIDAgMCAxLTQgMGEyIDIgMCAwIDEtNCAweiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Crown className="h-16 w-16 text-royal-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-royal-200 bg-clip-text text-transparent">
                 Customer Relationship Management
              </h1>
              <p className="text-xl md:text-2xl text-royal-100 max-w-3xl mx-auto leading-relaxed">
                Experience the future of customer management with our elegant, powerful, and secure CRM platform designed for modern businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup">
                <Button size="lg" className="bg-royal-600 hover:bg-royal-700 text-white shadow-2xl hover:shadow-royal-500/25">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-royal-400 text-royal-200 hover:bg-royal-800">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose CRM?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built with modern technologies and designed for exceptional user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full p-6 text-center">
                  <feature.icon className="h-12 w-12 text-royal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Trusted by businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-royal-600 to-royal-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-royal-100">
              Join thousands of businesses already using RoyalCRM to manage their customer relationships.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-royal-600 hover:bg-slate-50 shadow-2xl">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home