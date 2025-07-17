import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  showOverlay?: boolean; // Optional: show a semi-transparent overlay
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  showOverlay = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={`fixed inset-0 z-[9999] flex items-center justify-center ${showOverlay ? '' : 'static'} ${className}`}
        style={showOverlay ? { pointerEvents: 'none' } : {}}
      >
        {showOverlay && (
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" />
        )}
        <div className="relative flex flex-col items-center justify-center space-y-2">
          {/* Soft glow */}
          <div className="absolute -inset-4 rounded-full bg-blue-400/20 blur-2xl animate-pulse" />
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400 relative z-10`} />
      {text && (
            <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10" role="status" aria-live="polite">
          {text}
        </p>
      )}
    </div>
      </motion.div>
    </AnimatePresence>
  );
}