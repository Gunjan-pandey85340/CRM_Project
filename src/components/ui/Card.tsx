import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ className, hover = false, children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/20 overflow-hidden transition-all duration-300',
        hover && 'hover:shadow-xl hover:border-royal-200 dark:hover:border-royal-800',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card