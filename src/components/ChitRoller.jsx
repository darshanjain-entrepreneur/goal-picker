import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHabits, saveHabits, addPicked } from '../utils/storage';
import { pickRandomHabit } from '../utils/randomPicker';

const ChitRoller = ({ onAllComplete, onEditGoals }) => {
    const [phase, setPhase] = useState('ready'); // ready, rolling, revealed
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [displayHabits, setDisplayHabits] = useState([]);
    const [confetti, setConfetti] = useState([]);
    const [allDone, setAllDone] = useState(false);
    const [revealTime, setRevealTime] = useState('');
    const [sparks, setSparks] = useState([]);

    const loadHabits = useCallback(() => {
        const habits = getHabits();

        if (habits.length === 0) {
            setAllDone(true);
            return;
        }

        setDisplayHabits(habits.slice(0, 8));
        setAllDone(false);
    }, []);

    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    const triggerConfetti = () => {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700', '#38ef7d', '#00c6ff', '#ff6b6b'];
        const newConfetti = [];

        for (let i = 0; i < 80; i++) {
            newConfetti.push({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 5,
                rotation: Math.random() * 360,
                type: Math.random() > 0.5 ? 'circle' : 'rect',
            });
        }

        setConfetti(newConfetti);
        setTimeout(() => setConfetti([]), 4000);
    };

    const triggerSparks = () => {
        const newSparks = [];
        for (let i = 0; i < 30; i++) {
            newSparks.push({
                id: i,
                angle: (360 / 30) * i,
                delay: Math.random() * 0.2,
                distance: 80 + Math.random() * 60,
            });
        }
        setSparks(newSparks);
        setTimeout(() => setSparks([]), 1500);
    };

    const formatDateTime = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRoll = () => {
        if (phase !== 'ready' || displayHabits.length === 0) return;

        setPhase('rolling');

        setTimeout(() => {
            const habit = pickRandomHabit();

            if (habit) {
                const habits = getHabits();
                const updatedHabits = habits.filter(h => h.id !== habit.id);
                saveHabits(updatedHabits);
                addPicked(habit);

                setSelectedHabit(habit);
                setRevealTime(formatDateTime());
                setPhase('revealed');
                triggerConfetti();
                triggerSparks();
            }
        }, 4000);
    };

    const handleRollAgain = () => {
        setPhase('ready');
        setSelectedHabit(null);
        loadHabits();
    };

    // All goals picked
    if (allDone) {
        return (
            <motion.div
                className="screen roller-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="text-center"
                    initial={{ scale: 0, rotateZ: -10 }}
                    animate={{ scale: 1, rotateZ: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <motion.div
                        style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎉
                    </motion.div>
                    <h2>All Goals Picked!</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-sm) 0', fontSize: '0.9rem' }}>
                        You've selected all your goals. Time to achieve them!
                    </p>
                </motion.div>

                <div className="action-buttons">
                    <motion.button
                        className="btn btn-primary"
                        onClick={onEditGoals}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ✏️ Add New Goals
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="screen roller-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Celebration Effects */}
            <div className="celebration">
                {confetti.map((c) => (
                    <motion.div
                        key={c.id}
                        className="confetti"
                        style={{
                            left: `${c.x}%`,
                            backgroundColor: c.color,
                            width: c.size,
                            height: c.type === 'rect' ? c.size * 2 : c.size,
                            borderRadius: c.type === 'circle' ? '50%' : '2px',
                        }}
                        initial={{ y: -50, opacity: 1, rotate: 0, scale: 0 }}
                        animate={{
                            y: '110vh',
                            opacity: [1, 1, 1, 0],
                            rotate: c.rotation + 1080,
                            scale: [0, 1.2, 1, 0.5],
                            x: [0, Math.sin(c.id) * 50, 0],
                        }}
                        transition={{ duration: 4, delay: c.delay, ease: 'easeOut' }}
                    />
                ))}
            </div>

            {/* Spark Burst Effect */}
            <div className="spark-container">
                {sparks.map((s) => (
                    <motion.div
                        key={s.id}
                        className="spark"
                        initial={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                        }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            x: Math.cos(s.angle * Math.PI / 180) * s.distance,
                            y: Math.sin(s.angle * Math.PI / 180) * s.distance,
                        }}
                        transition={{ duration: 0.8, delay: s.delay, ease: 'easeOut' }}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'ready' && (
                    <motion.div
                        key="ready-header"
                        className="roller-header"
                        initial={{ opacity: 0, y: -30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                    >
                        <motion.h2
                            className="roller-title"
                            animate={{
                                textShadow: [
                                    '0 0 10px rgba(102, 126, 234, 0.3)',
                                    '0 0 20px rgba(102, 126, 234, 0.6)',
                                    '0 0 10px rgba(102, 126, 234, 0.3)',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✨ Pick Your Goal
                        </motion.h2>
                        <p className="roller-subtitle">
                            {displayHabits.length} goal{displayHabits.length !== 1 ? 's' : ''} waiting
                        </p>
                    </motion.div>
                )}

                {phase === 'rolling' && (
                    <motion.div
                        key="rolling-header"
                        className="roller-header"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.h2
                            className="roller-title"
                            animate={{
                                scale: [1, 1.05, 1],
                                color: ['#fff', '#ffd700', '#fff'],
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            🎲 Picking...
                        </motion.h2>
                    </motion.div>
                )}

                {phase === 'revealed' && (
                    <motion.div
                        key="revealed-header"
                        className="roller-header"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                    >
                        <motion.h2
                            className="roller-title"
                            animate={{
                                textShadow: [
                                    '0 0 20px rgba(255, 215, 0, 0.5)',
                                    '0 0 40px rgba(255, 215, 0, 0.8)',
                                    '0 0 20px rgba(255, 215, 0, 0.5)',
                                ]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            🎯 Today's Goal
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="chit-container">
                <AnimatePresence mode="wait">
                    {phase === 'ready' && displayHabits.length > 0 && (
                        <motion.div
                            key="chits-ready"
                            className="chit-roller"
                            animate={{ rotateY: 360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Center glow */}
                            <motion.div
                                className="roller-glow"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />

                            {displayHabits.map((habit, index) => {
                                const angle = (360 / displayHabits.length) * index;
                                const radius = Math.min(110, 85 + displayHabits.length * 5);
                                return (
                                    <motion.div
                                        key={habit.id}
                                        className="chit"
                                        style={{
                                            transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ delay: index * 0.1, type: 'spring' }}
                                    >
                                        <span className="chit-mystery">?</span>
                                        <span className="chit-number">#{index + 1}</span>
                                        <div className="chit-shine" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {phase === 'rolling' && (
                        <motion.div
                            key="chits-rolling"
                            className="chit-roller"
                            style={{ transformStyle: 'preserve-3d' }}
                            animate={{
                                rotateY: [0, 2880],
                                rotateX: [0, 360, 720, 1080, 720, 360, 0],
                                rotateZ: [0, 15, -15, 10, -10, 0],
                                scale: [1, 1.15, 0.9, 1.1, 0.95, 1],
                            }}
                            transition={{
                                duration: 4,
                                ease: [0.2, 0.8, 0.2, 1],
                            }}
                        >
                            {/* Intense glow during roll */}
                            <motion.div
                                className="roller-glow intense"
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{ duration: 0.3, repeat: 13 }}
                            />

                            {displayHabits.map((habit, index) => {
                                const angle = (360 / displayHabits.length) * index;
                                const radius = Math.min(110, 85 + displayHabits.length * 5);
                                return (
                                    <motion.div
                                        key={habit.id}
                                        className="chit rolling"
                                        style={{
                                            transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                        }}
                                        animate={{
                                            boxShadow: [
                                                '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(102,126,234,0.3)',
                                                '0 20px 60px rgba(102,126,234,0.6), 0 0 40px rgba(255,215,0,0.5)',
                                                '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(240,147,251,0.3)',
                                            ],
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            repeat: 13,
                                        }}
                                    >
                                        <motion.span
                                            className="chit-mystery"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [1, 0.7, 1],
                                            }}
                                            transition={{ duration: 0.2, repeat: 20 }}
                                        >
                                            ?
                                        </motion.span>
                                        <span className="chit-number">#{index + 1}</span>
                                        <div className="chit-shine active" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {phase === 'revealed' && selectedHabit && (
                        <motion.div
                            key="revealed"
                            className="revealed-container"
                            initial={{ scale: 0, rotateY: 540, opacity: 0 }}
                            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                            transition={{
                                type: 'spring',
                                damping: 12,
                                stiffness: 80,
                            }}
                        >
                            <motion.div
                                className="revealed-card"
                                animate={{
                                    boxShadow: [
                                        '0 0 30px rgba(102, 126, 234, 0.4), 0 0 60px rgba(102, 126, 234, 0.2)',
                                        '0 0 50px rgba(255, 215, 0, 0.5), 0 0 100px rgba(102, 126, 234, 0.3)',
                                        '0 0 30px rgba(240, 147, 251, 0.4), 0 0 60px rgba(240, 147, 251, 0.2)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <motion.div
                                    className="revealed-icon"
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🏆
                                </motion.div>
                                <p className="revealed-date">📅 {revealTime}</p>
                                <p className="revealed-text">{selectedHabit.text}</p>
                                <motion.p
                                    className="revealed-footer"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    ✅ Goal activated!
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {phase === 'ready' && displayHabits.length > 0 && (
                    <motion.div
                        key="roll-action"
                        className="action-buttons"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                    >
                        <motion.button
                            className="btn btn-gold btn-roll"
                            onClick={handleRoll}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                boxShadow: [
                                    '0 4px 25px rgba(255, 215, 0, 0.4)',
                                    '0 4px 35px rgba(255, 215, 0, 0.6)',
                                    '0 4px 25px rgba(255, 215, 0, 0.4)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🎲 Roll the Dice!
                        </motion.button>
                    </motion.div>
                )}

                {phase === 'revealed' && (
                    <motion.div
                        key="revealed-actions"
                        className="action-buttons"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.button
                            className="btn btn-primary"
                            onClick={handleRollAgain}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(102, 126, 234, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🎲 Pick Another
                        </motion.button>
                        <motion.button
                            className="btn btn-secondary"
                            onClick={onEditGoals}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ✏️ Edit Goals
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ChitRoller;
