
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
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        className="flex items-center space-x-4"
      >
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 2
            }}
        >
            <Sparkles className="h-16 w-16 text-primary" />
        </motion.div>
        <span className="text-4xl font-bold font-headline text-foreground">
          AI Interviewer
        </span>
      </motion.div>
    </motion.div>
  );
}
