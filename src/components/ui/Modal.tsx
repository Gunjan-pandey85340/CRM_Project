import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, className, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              'relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto',
              className
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              {title && (
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal