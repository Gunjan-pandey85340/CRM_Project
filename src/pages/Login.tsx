import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Mail, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginForm = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <Crown className="h-12 w-12 text-royal-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Sign in to your RoyalCRM account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Enter your password"
                className="pl-10"
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-royal-200 text-sm">
            Demo Admin Account: gunjanpandey8979@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login