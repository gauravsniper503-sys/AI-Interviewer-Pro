
'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div
        className="flex items-center space-x-4"
      >
        <motion.div
            initial={{ opacity: 0, scale: 3, x: -100, y: -50, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 360 }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 20,
                delay: 0.2,
                duration: 1.0,
            }}
        >
            <Sparkles className="h-16 w-16 text-primary" />
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <span className="text-4xl font-bold font-headline text-foreground">
            AI Interviewer
            </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
