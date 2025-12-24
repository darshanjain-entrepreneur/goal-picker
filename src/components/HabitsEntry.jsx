import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveHabits, lockHabits, getHabits, clearHabitsAndProgress } from '../utils/storage';

const HabitsEntry = ({ userName, onComplete, onReset }) => {
    const [habits, setHabits] = useState(() => getHabits());
    const [inputValue, setInputValue] = useState('');
    const [isLocking, setIsLocking] = useState(false);

    const maxHabits = 20;

    const addHabit = () => {
        if (!inputValue.trim() || habits.length >= maxHabits) return;

        const newHabit = {
            id: Date.now(),
            text: inputValue.trim(),
            createdAt: new Date().toISOString(),
        };

        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        saveHabits(updatedHabits);
        setInputValue('');
    };

    const removeHabit = (id) => {
        const updatedHabits = habits.filter(h => h.id !== id);
        setHabits(updatedHabits);
        saveHabits(updatedHabits);
    };

    const clearAllHabits = () => {
        setHabits([]);
        clearHabitsAndProgress();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addHabit();
        }
    };

    const handleLockIn = () => {
        if (habits.length === 0) return;

        setIsLocking(true);
        lockHabits();

        setTimeout(() => {
            onComplete();
        }, 600);
    };

    return (
        <motion.div
            className="screen habits-screen"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
        >
            <div className="habits-header">
                <motion.p
                    className="habits-greeting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Hey {userName}! 👋
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Set Your Goals
                </motion.h2>
                <p className="habits-count">
                    {habits.length} / {maxHabits} goals
                </p>
            </div>

            <motion.div
                className="habits-input-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <input
                    type="text"
                    className="input-field"
                    placeholder="Type a goal..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength={80}
                    disabled={habits.length >= maxHabits}
                />
                <motion.button
                    className="btn btn-primary add-btn"
                    onClick={addHabit}
                    disabled={!inputValue.trim() || habits.length >= maxHabits}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    +
                </motion.button>
            </motion.div>

            {habits.length > 0 && (
                <div className="habits-actions-top">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={clearAllHabits}
                    >
                        🗑️ Clear
                    </button>
                </div>
            )}

            <div className="habits-list">
                <AnimatePresence mode="popLayout">
                    {habits.map((habit, index) => (
                        <motion.div
                            key={habit.id}
                            className="habit-card"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            layout="position"
                            layoutId={habit.id}
                        >
                            <span className="habit-number">{index + 1}</span>
                            <span className="habit-text">{habit.text}</span>
                            <motion.button
                                className="habit-delete"
                                onClick={() => removeHabit(habit.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ✕
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {habits.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <p>Add your goals above!</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {habits.length > 0 && (
                    <motion.div
                        className="habits-actions"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                    >
                        <motion.button
                            className="btn btn-gold"
                            onClick={handleLockIn}
                            disabled={isLocking}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLocking ? (
                                <span className="loading">
                                    <span className="loading-dot"></span>
                                    <span className="loading-dot"></span>
                                    <span className="loading-dot"></span>
                                </span>
                            ) : (
                                <>🎲 Start Picking</>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HabitsEntry;
