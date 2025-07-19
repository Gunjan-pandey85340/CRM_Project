import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Crown, Lock, Eye, Database, UserCheck } from 'lucide-react'
import Card from '../components/ui/Card'

const Privacy: React.FC = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, submit tickets, or contact us. This includes your name, email address, phone number, company information, and any content you submit through our platform."
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services; process transactions; send you technical notices and support messages; respond to your comments and questions; and communicate with you about products, services, and events."
    },
    {
      icon: UserCheck,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our platform and conducting our business."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use encryption, secure servers, and regular security assessments."
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. If you wish to exercise these rights, please contact us using the information provided below."
    }
  ]

  const dataTypes = [
    {
      category: "Account Information",
      items: ["Email address", "Full name", "Phone number", "Company name", "Password (encrypted)"]
    },
    {
      category: "Usage Data",
      items: ["Login timestamps", "Feature usage", "Support ticket history", "Feedback submissions"]
    },
    {
      category: "Technical Data",
      items: ["IP address", "Browser type", "Device information", "Session data"]
    }
  ]

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
            <Shield className="h-12 w-12 text-royal-600 mr-4" />
            <Crown className="h-12 w-12 text-royal-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            Last updated: January 1, 2024
          </p>
        </motion.div>

        {/* Privacy Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Our Commitment to Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              At RoyalCRM, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Lock className="h-8 w-8 text-royal-600 dark:text-royal-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Secure by Design</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-royal-600 dark:text-royal-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">GDPR Compliant</p>
              </div>
              <div className="text-center">
                <UserCheck className="h-8 w-8 text-royal-600 dark:text-royal-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Your Control</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Data We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dataTypes.map((type, index) => (
                <div key={type.category} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">
                    {type.category}
                  </h3>
                  <ul className="space-y-1">
                    {type.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-royal-400 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-royal-100 dark:bg-royal-900 rounded-lg">
                    <section.icon className="h-6 w-6 text-royal-600 dark:text-royal-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Data Retention
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Account Data
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We retain your account information for as long as your account is active or as needed to provide you services.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Support Data
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Support tickets and feedback are retained for 3 years to help us improve our services and provide better support.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Questions About Your Privacy?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center">
                  <span className="font-medium text-slate-900 dark:text-white">Email:</span>
                  <span className="ml-2 text-royal-600 dark:text-royal-400">privacy@royalcrm.com</span>
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

export default Privacy