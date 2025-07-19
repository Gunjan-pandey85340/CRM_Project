import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Target, Users, Zap, Shield, Award } from 'lucide-react'
import Card from '../components/ui/Card'

const About: React.FC = () => {
  const values = [
    {
      icon: Crown,
      title: 'Excellence',
      description: 'We strive for perfection in every aspect of our platform, delivering premium quality solutions.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your data security is our top priority. We implement enterprise-grade security measures.'
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Everything we build is designed with our users in mind, ensuring intuitive and powerful experiences.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously innovate to stay ahead of the curve and provide cutting-edge solutions.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '1M+', label: 'Tickets Processed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-royal-900 via-royal-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Crown className="h-16 w-16 text-royal-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-royal-200 bg-clip-text text-transparent">
                About CRM
              </h1>
              <p className="text-xl md:text-2xl text-royal-100 max-w-3xl mx-auto leading-relaxed">
                We're on a mission to revolutionize customer relationship management with premium design, powerful features, and exceptional user experience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-royal-600 mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                At CRM, we believe that customer relationship management should be both powerful and beautiful. Our platform combines enterprise-grade functionality with an elegant, intuitive interface that makes managing customer relationships a pleasure rather than a chore.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                We're committed to providing businesses of all sizes with the tools they need to build stronger customer relationships, improve support efficiency, and drive growth through better customer insights.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-royal-100 to-royal-50 dark:from-royal-900 dark:to-royal-800 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-royal-600 dark:text-royal-400 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full p-6 text-center">
                  <value.icon className="h-12 w-12 text-royal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Award className="h-16 w-16 text-royal-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              CRM is built on a foundation of cutting-edge technologies to ensure reliability, scalability, and exceptional performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-royal-600 font-semibold text-lg mb-2">Frontend</div>
              <p className="text-slate-600 dark:text-slate-300">
                React, TypeScript, Tailwind CSS, and Framer Motion for a smooth, responsive interface
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-royal-600 font-semibold text-lg mb-2">Backend</div>
              <p className="text-slate-600 dark:text-slate-300">
                Supabase with PostgreSQL for secure, real-time data management
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-royal-600 font-semibold text-lg mb-2">Security</div>
              <p className="text-slate-600 dark:text-slate-300">
                Row-level security, role-based access control, and enterprise-grade encryption
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-royal-600 to-royal-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl mb-8 text-royal-100">
              Become part of a community that values excellence, innovation, and customer success.
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
                <Users className="h-12 w-12 text-royal-200 mx-auto mb-4" />
                <p className="text-royal-100">
                  "CRM has transformed how we manage customer relationships. The platform is intuitive, powerful, and beautifully designed."
                </p>
                <div className="mt-4">
                  <p className="font-semibold">Jessica Chen</p>
                  <p className="text-royal-200 text-sm">Customer Success Manager</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About