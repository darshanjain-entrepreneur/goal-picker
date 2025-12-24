import { getHabits, getRevealed } from './storage';

// Pick a random habit from the remaining list
export const pickRandomHabit = () => {
    const habits = getHabits();

    if (habits.length === 0) {
        return null;
    }

    // Pick a random one
    const randomIndex = Math.floor(Math.random() * habits.length);
    return habits[randomIndex];
};

// Check if all habits have been revealed (no habits left)
export const isAllRevealed = () => {
    const habits = getHabits();
    return habits.length === 0;
};
