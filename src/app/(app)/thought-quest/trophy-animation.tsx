
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './trophy-animation.css';

interface TrophyAnimationProps {
    trophyName: string;
    onAnimationComplete: () => void;
}

const trophyColors: Record<string, string> = {
    'Bronze': '#8B4513',
    'Silver': '#C0C0C0',
    'Gold': '#FFD700',
    'Platinum': '#E5E4E2',
    'Diamond': '#B9F2FF'
};

const StarIcon = ({ color }: { color: string }) => (
    <svg viewBox="0 0 24 24" fill={color}>
        <path d="M12 .587l3.668 7.431L24 9.75l-6 5.848L19.335 24 12 20.018 4.665 24 6 15.598 0 9.75l8.332-1.732z" />
    </svg>
);

const Particle = ({ color }: { color: string }) => {
    const x = (Math.random() - 0.5) * 350;
    const y = (Math.random() - 0.5) * 350;
    const animationDelay = `${Math.random() * 0.5}s`;

    return (
        <motion.div
            className="particle"
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
                opacity: 0,
                scale: 0.6,
                x: x,
                y: y
            }}
            transition={{ duration: 2, delay: animationDelay, ease: "easeOut" }}
        >
           <StarIcon color={color} />
        </motion.div>
    );
};


export const TrophyAnimation = ({ trophyName, onAnimationComplete }: TrophyAnimationProps) => {
    const [visible, setVisible] = useState(true);
    const color = trophyColors[trophyName] || '#FFD700';

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onAnimationComplete();
        }, 4000); // Total animation duration + buffer

        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="trophy-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="trophy-container">
                        <motion.div
                            className="main-star"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        >
                           <StarIcon color={color} />
                        </motion.div>

                        <motion.div
                            className="message"
                            style={{ color }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                        >
                            Congratulations! You earned the <b>{trophyName} Star!</b>
                        </motion.div>

                        {Array.from({ length: 30 }).map((_, i) => (
                            <Particle key={i} color={color} />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
