import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Loader.module.css';

const phaseText = [
  '',
  'Retreiving Tweets...',
  'Analyzing Tweet Toxicity...',
] as const;

export default function Loader() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => {
    setTimeout(() => {
      setPhase(1);
      setTimeout(() => setPhase(2), 5000);
    }, 2000);
  }, []);
  return (
    <motion.div
      className={styles.ringBackground}
      animate={{ scale: 1.1 }}
      transition={{
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'reverse',
        duration: 1.1,
        delay: 0.4,
      }}
    >
      <motion.div
        className={styles.ringForeground}
        animate={{ scale: 0.8 }}
        transition={{
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse',
          duration: 1,
        }}
      />
      <motion.h3 layout className={styles.text}>
        {phaseText[phase]}
      </motion.h3>
    </motion.div>
  );
}
