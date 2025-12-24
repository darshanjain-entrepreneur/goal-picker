import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import HabitsEntry from './components/HabitsEntry';
import ChitRoller from './components/ChitRoller';
import ProgressTracker from './components/ProgressTracker';
import { getUser, isHabitsLocked, getHabits, resetAllData, unlockHabits } from './utils/storage';
import './App.css';

// Generate floating particles with variety
const generateParticles = () => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#ffd700', '#38ef7d', '#00c6ff'];
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 20,
    size: Math.random() * 6 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    blur: Math.random() > 0.7,
  }));
};

// Generate floating orbs
const generateOrbs = () => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 100 + Math.random() * 200,
    color: ['rgba(102, 126, 234, 0.15)', 'rgba(240, 147, 251, 0.12)', 'rgba(255, 215, 0, 0.1)', 'rgba(56, 239, 125, 0.1)', 'rgba(245, 87, 108, 0.1)'][i],
    duration: 20 + Math.random() * 15,
  }));
};

function App() {
  const [screen, setScreen] = useState('loading');
  const [userName, setUserName] = useState('');
  const [particles] = useState(generateParticles);
  const [orbs] = useState(generateOrbs);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const user = getUser();
    const locked = isHabitsLocked();
    const habits = getHabits();

    if (!user) {
      setScreen('welcome');
    } else {
      setUserName(user.name);

      if (!locked || habits.length === 0) {
        setScreen('habits');
      } else {
        setScreen('roller');
      }
    }
  }, [refreshKey]);

  const handleWelcomeComplete = (name) => {
    setUserName(name);
    setScreen('habits');
  };

  const handleHabitsComplete = () => {
    setScreen('roller');
  };

  const handleShowProgress = () => {
    setScreen('progress');
  };

  const handleBackToRoller = () => {
    setScreen('roller');
  };

  const handleEditGoals = () => {
    unlockHabits();
    setScreen('habits');
  };

  const handleResetAll = () => {
    resetAllData();
    setUserName('');
    setRefreshKey(prev => prev + 1);
    setScreen('welcome');
  };

  if (screen === 'loading') {
    return (
      <div className="app-container">
        <div className="content">
          <div className="loading" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Mesh Grid */}
      <div className="mesh-grid" />

      {/* Floating Orbs */}
      <div className="orbs-container">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="floating-orb"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
              scale: [1, 1.2, 0.9, 1.1, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`particle ${p.blur ? 'blur' : ''}`}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              willChange: 'transform, opacity' // Optimization
            }}
            animate={{
              y: ['100vh', '-10vh'],
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="content">
        {/* Top Navigation */}
        {(screen === 'roller' || screen === 'habits') && (
          <nav className="top-nav">
            {screen === 'habits' && userName && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleShowProgress}
                >
                  📊 History
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetAll}
                >
                  🔄 Reset
                </button>
              </>
            )}
            {screen === 'roller' && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleEditGoals}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleShowProgress}
                >
                  📊 History
                </button>
              </>
            )}
          </nav>
        )}

        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <WelcomeScreen
              key="welcome"
              onComplete={handleWelcomeComplete}
            />
          )}

          {screen === 'habits' && (
            <HabitsEntry
              key="habits"
              userName={userName}
              onComplete={handleHabitsComplete}
              onReset={handleResetAll}
            />
          )}

          {screen === 'roller' && (
            <ChitRoller
              key="roller"
              onAllComplete={handleShowProgress}
              onEditGoals={handleEditGoals}
            />
          )}

          {screen === 'progress' && (
            <ProgressTracker
              key="progress"
              onBack={handleBackToRoller}
              onReset={handleResetAll}
              onEditGoals={handleEditGoals}
            />
          )}
        </AnimatePresence>

        {/* Footer Credit */}
        <footer className="app-footer">
          Founded by Darshan Jain
        </footer>
      </div>
    </div>
  );
}

export default App;
