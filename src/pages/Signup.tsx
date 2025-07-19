import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Mail, Lock, User, Phone, Building } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  company: z.string().min(2, 'Company name must be at least 2 characters').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type SignupForm = z.infer<typeof signupSchema>

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupForm) => {
    try {
      console.log('Submitting signup with data:', {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        company: data.company
      })
      
      await signUp(
        data.email, 
        data.password, 
        data.fullName, 
        data.phone || undefined, 
        data.company || undefined
      )
      
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <Crown className="h-12 w-12 text-royal-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Join RoyalCRM and start managing your customer relationships
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                label="Full Name"
                {...register('fullName')}
                error={errors.fullName?.message}
                placeholder="John Doe"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="your@email.com"
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  label="Phone Number (Optional)"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  label="Company (Optional)"
                  {...register('company')}
                  error={errors.company?.message}
                  placeholder="Your Company"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Create a password"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your password"
                className="pl-10"
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Signup