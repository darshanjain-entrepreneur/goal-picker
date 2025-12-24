// LocalStorage Keys
const STORAGE_KEYS = {
  USER: 'goals_user',
  HABITS: 'goals_habits',
  PICKED: 'goals_picked',
  LOCKED: 'goals_locked',
};

// User Management
export const saveUser = (name) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name, createdAt: new Date().toISOString() }));
};

export const getUser = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Habits Management
export const saveHabits = (habits) => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const getHabits = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Lock status
export const lockHabits = () => {
  localStorage.setItem(STORAGE_KEYS.LOCKED, 'true');
};

export const unlockHabits = () => {
  localStorage.removeItem(STORAGE_KEYS.LOCKED);
};

export const isHabitsLocked = () => {
  return localStorage.getItem(STORAGE_KEYS.LOCKED) === 'true';
};

// Picked habits history (for progress tracking)
export const getPicked = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PICKED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addPicked = (habit) => {
  const picked = getPicked();
  const newPicked = {
    ...habit,
    pickedAt: new Date().toISOString(),
  };
  picked.push(newPicked);
  localStorage.setItem(STORAGE_KEYS.PICKED, JSON.stringify(picked));
  return picked;
};

export const clearPicked = () => {
  localStorage.removeItem(STORAGE_KEYS.PICKED);
};

// Alias for compatibility
export const getRevealed = getPicked;
export const addRevealed = addPicked;
export const clearRevealed = clearPicked;

// Reset all data
export const resetAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Clear only habits (keep user and history)
export const clearHabitsAndProgress = () => {
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.LOCKED);
};
