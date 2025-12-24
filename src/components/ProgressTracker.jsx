import { motion } from 'framer-motion';
import { getPicked, getHabits } from '../utils/storage';

const ProgressTracker = ({ onBack, onReset, onEditGoals }) => {
    const picked = getPicked();
    const habits = getHabits();
    const total = picked.length + habits.length;
    const completed = picked.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            className="screen progress-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="progress-header">
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Your Progress
                </motion.h2>
            </div>

            <motion.div
                className="progress-ring"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
            >
                <svg width="120" height="120">
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#38ef7d" />
                        </linearGradient>
                    </defs>
                    <circle
                        className="progress-bg"
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        strokeWidth="8"
                    />
                    <motion.circle
                        className="progress-fill"
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                </svg>
                <span className="progress-text">{Math.round(percentage)}%</span>
            </motion.div>

            <div className="progress-stats">
                <div className="stat-item">
                    <div className="stat-value">{completed}</div>
                    <div className="stat-label">Picked</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{habits.length}</div>
                    <div className="stat-label">Remaining</div>
                </div>
            </div>

            {picked.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                    <h3 style={{ marginBottom: 'var(--space-sm)', flexShrink: 0 }}>Picked Goals</h3>
                    <div className="completed-list">
                        {picked.map((habit, index) => (
                            <motion.div
                                key={habit.id}
                                className="completed-item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                            >
                                <span className="completed-icon">✓</span>
                                <span className="completed-text">{habit.text}</span>
                                <span className="completed-date">{formatDate(habit.pickedAt)}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {picked.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <p>No goals picked yet</p>
                </div>
            )}

            <motion.div
                className="action-buttons progress-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.button
                    className="btn btn-primary"
                    onClick={onBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    ← Picker
                </motion.button>
                <motion.button
                    className="btn btn-secondary"
                    onClick={onEditGoals}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    ✏️ Edit
                </motion.button>
                <motion.button
                    className="btn btn-secondary"
                    onClick={onReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🔄 Reset
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default ProgressTracker;
