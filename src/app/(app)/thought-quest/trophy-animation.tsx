
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
    'Silver': 'url(#silverGradient)',
    'Gold': 'url(#goldGradient)',
    'Platinum': 'url(#platinumGradient)',
    'Diamond': 'url(#diamondGradient)'
};

const StarIcon = ({ color, trophyName }: { color: string, trophyName: string }) => (
    <svg viewBox="0 0 24 24" fill={color}>
        <defs>
            {trophyName === 'Silver' && (
                <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8f8f8"/>
                    <stop offset="40%" stopColor="#c0c0c0"/>
                    <stop offset="80%" stopColor="#a0a0a0"/>
                    <stop offset="100%" stopColor="#f8f8f8"/>
                </linearGradient>
            )}
            {trophyName === 'Gold' && (
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffec5c" />
                    <stop offset="50%" stopColor="#fff1a8" />
                    <stop offset="100%" stopColor="#ffec5c" />
                </linearGradient>
            )}
             {trophyName === 'Platinum' && (
                <linearGradient id="platinumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b388ff" />
                    <stop offset="50%" stopColor="#d1c4e9" />
                    <stop offset="100%" stopColor="#b388ff" />
                </linearGradient>
            )}
             {trophyName === 'Diamond' && (
                <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b3e5fc" />
                    <stop offset="50%" stopColor="#e0f7fa" />
                    <stop offset="100%" stopColor="#b3e5fc" />
                </linearGradient>
            )}
        </defs>
        <path d="M12 .587l3.668 7.431L24 9.75l-6 5.848L19.335 24 12 20.018 4.665 24 6 15.598 0 9.75l8.332-1.732z" />
    </svg>
);

const Particle = ({ trophyName }: { trophyName: string }) => {
    const x = (Math.random() - 0.5) * 350;
    const y = (Math.random() - 0.5) * 350;
    const animationDelay = `${Math.random() * 0.5}s`;
    
    let color = trophyColors[trophyName] || '#FFD700';
    let particleContent: React.ReactNode = <StarIcon color={color} trophyName={trophyName} />;
    let textShadow = 'none';

    if (trophyName === 'Gold' || trophyName === 'Platinum' || trophyName === 'Diamond') {
        particleContent = '⭐';
        if (trophyName === 'Gold') {
            color = '#ffeb3b';
            textShadow = '0 0 8px #ffee58';
        } else if (trophyName === 'Platinum') {
            color = '#c084fc';
            textShadow = '0 0 10px #d8b4fe';
        } else {
             color = '#81d4fa';
             textShadow = '0 0 10px #b3e5fc';
        }
    }


    return (
         <motion.div
            className="particle"
            style={{ color, textShadow }}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
                opacity: 0,
                scale: 0.6,
                x: x,
                y: y
            }}
            transition={{ duration: 2, delay: animationDelay, ease: "easeOut" }}
        >
           {particleContent}
        </motion.div>
    )
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

    let messageStyle = {};
    let messageText: React.ReactNode = <>Congratulations! You earned the <b>{trophyName} Star!</b></>;

    if (trophyName === 'Silver') {
         messageStyle = { background: 'linear-gradient(90deg, #f1f1f1, #a3a3a3, #e5e5e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
    } else if (trophyName === 'Gold') {
        messageStyle = { color: '#ffeb3b', textShadow: '0 0 8px #ffee58'};
        messageText = <>🏅 Congratulations! You earned the <b>{trophyName} Star!</b> 🏅</>;
    } else if (trophyName === 'Platinum') {
        messageStyle = { color: '#c084fc', textShadow: '0 0 10px #d8b4fe'};
        messageText = <>💎 Congratulations! You earned the <b>{trophyName} Star!</b> 💎</>;
    } else if (trophyName === 'Diamond') {
        messageStyle = { color: '#81d4fa', textShadow: '0 0 12px #b3e5fc'};
        messageText = <>💠 Congratulations! You earned the <b>{trophyName} Star!</b> 💠</>;
    }
    else {
        messageStyle = { color };
    }

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
                           <StarIcon color={color} trophyName={trophyName}/>
                        </motion.div>

                        <motion.div
                            className="message"
                            style={messageStyle}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                        >
                            {messageText}
                        </motion.div>

                        {Array.from({ length: 30 }).map((_, i) => (
                            <Particle key={i} trophyName={trophyName}/>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
