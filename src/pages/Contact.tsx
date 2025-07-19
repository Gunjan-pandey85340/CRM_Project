import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactForm = z.infer<typeof contactSchema>

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'support@royalcrm.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: '123 Business Street',
      description: 'San Francisco, CA 94105'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 8am-6pm PST',
      description: 'Saturday: 9am-4pm PST'
    }
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
              <Mail className="h-16 w-16 text-royal-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-royal-200 bg-clip-text text-transparent">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl text-royal-100 max-w-3xl mx-auto leading-relaxed">
                Have questions about CRM? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full p-6 text-center">
                  <info.icon className="h-12 w-12 text-royal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {info.title}
                  </h3>
                  <p className="text-royal-600 dark:text-royal-400 font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {info.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Send us a Message
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Fill out the form below and we'll get back to you within 24 hours. For urgent matters, please call us directly.
              </p>
              
              <Card className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      {...register('name')}
                      error={errors.name?.message}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <Input
                    label="Subject"
                    {...register('subject')}
                    error={errors.subject?.message}
                    placeholder="What's this about?"
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200"
                      placeholder="Tell us more about your question or feedback..."
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      How quickly do you respond?
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      Do you offer phone support?
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Yes, phone support is available Monday-Friday, 8am-6pm PST.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      Can I schedule a demo?
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Absolutely! Mention it in your message and we'll set up a personalized demo.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-900 dark:to-royal-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Need Immediate Help?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  For existing customers with urgent technical issues, please use our priority support channels.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    📧 Priority Email: priority@crm.com
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    📞 Emergency Line: +1 (555) 123-4567 ext. 911
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact