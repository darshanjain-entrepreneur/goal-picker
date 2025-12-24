import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveUser } from '../utils/storage';

const WelcomeScreen = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        saveUser(name.trim());

        setTimeout(() => {
            onComplete(name.trim());
        }, 400);
    };

    return (
        <motion.div
            className="screen welcome-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="welcome-logo"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.6 }}
            >
                🎯
            </motion.div>

            <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="welcome-title">Goal Picker</h1>
            </motion.div>

            <motion.p
                className="welcome-subtitle"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Set goals, spin the wheel, achieve dreams ✨
            </motion.p>

            <motion.form
                className="welcome-form"
                onSubmit={handleSubmit}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <input
                    type="text"
                    className="input-field"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    autoFocus
                />

                <motion.button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={!name.trim() || isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <span className="loading">
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                        </span>
                    ) : (
                        'Get Started →'
                    )}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default WelcomeScreen;
