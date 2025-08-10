'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiEffectProps {
  trigger: boolean;
  type?: 'confetti' | 'starburst';
}

const ConfettiPiece = ({ index, type }: { index: number; type: 'confetti' | 'starburst' }) => {
  const colors = ['#e60012', '#0066cc', '#ffcc00', '#00a652', '#8b5fbf', '#ff6600'];
  const color = colors[index % colors.length];
  
  const randomX = Math.random() * 200 - 100;
  const randomY = Math.random() * 200 - 100;
  const randomRotate = Math.random() * 360;
  const randomScale = 0.5 + Math.random() * 0.5;
  
  if (type === 'starburst') {
    return (
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ 
          x: 0, 
          y: 0, 
          scale: 0,
          rotate: 0
        }}
        animate={{ 
          x: randomX * 2, 
          y: randomY * 2, 
          scale: [0, randomScale * 1.5, 0],
          rotate: randomRotate * 2
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          times: [0, 0.3, 1]
        }}
      />
    );
  }
  
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: color }}
      initial={{ 
        x: 0, 
        y: -20, 
        rotate: 0,
        scale: 0
      }}
      animate={{ 
        x: randomX, 
        y: randomY + 100, 
        rotate: randomRotate,
        scale: [0, randomScale, randomScale * 0.5]
      }}
      transition={{ 
        duration: 1.2,
        ease: "easeOut",
        times: [0, 0.1, 1]
      }}
    />
  );
};

export default function ConfettiEffect({ trigger, type = 'confetti' }: ConfettiEffectProps) {
  const [showEffect, setShowEffect] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      setShowEffect(true);
      const timer = setTimeout(() => setShowEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  const particleCount = type === 'confetti' ? 20 : 12;
  
  return (
    <AnimatePresence>
      {showEffect && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: particleCount }).map((_, index) => (
            <ConfettiPiece key={index} index={index} type={type} />
          ))}
          
          {type === 'starburst' && (
            <motion.div
              className="absolute text-6xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.2, 1], rotate: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "backOut",
                times: [0, 0.7, 1]
              }}
            >
              ⭐
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 