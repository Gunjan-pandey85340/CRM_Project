import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Crown } from 'lucide-react'
import Card from '../components/ui/Card'

const Terms: React.FC = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using RoyalCRM, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of RoyalCRM per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained in RoyalCRM; or remove any copyright or other proprietary notations from the materials."
    },
    {
      title: "3. Disclaimer",
      content: "The materials on RoyalCRM are provided on an 'as is' basis. RoyalCRM makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      title: "4. Limitations",
      content: "In no event shall RoyalCRM or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use RoyalCRM, even if RoyalCRM or a RoyalCRM authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      title: "5. Privacy Policy",
      content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using RoyalCRM, you agree to the collection and use of information in accordance with our Privacy Policy."
    },
    {
      title: "6. User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account."
    },
    {
      title: "7. Prohibited Uses",
      content: "You may not use our service: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information."
    },
    {
      title: "8. Termination",
      content: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms."
    },
    {
      title: "9. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect."
    },
    {
      title: "10. Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us at legal@royalcrm.com or by mail at: RoyalCRM Legal Department, 123 Business Street, San Francisco, CA 94105."
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
            <FileText className="h-12 w-12 text-royal-600 mr-4" />
            <Crown className="h-12 w-12 text-royal-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Please read these terms carefully before using RoyalCRM
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            Last updated: January 1, 2024
          </p>
        </motion.div>

        {/* Terms Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="bg-royal-50 dark:bg-royal-900/20 border border-royal-200 dark:border-royal-800 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-royal-900 dark:text-royal-100 mb-2">
                  Agreement Overview
                </h2>
                <p className="text-royal-800 dark:text-royal-200 text-sm">
                  These Terms of Service ("Terms") govern your use of RoyalCRM's customer relationship management platform. 
                  By using our service, you agree to these terms in full.
                </p>
              </div>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="border-l-4 border-royal-200 dark:border-royal-800 pl-6"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Questions About Our Terms?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                If you have any questions about these Terms of Service, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center">
                  <span className="font-medium text-slate-900 dark:text-white">Email:</span>
                  <span className="ml-2 text-royal-600 dark:text-royal-400">legal@royalcrm.com</span>
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

export default Terms