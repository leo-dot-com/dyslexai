// Cache user data in memory to minimize localStorage access
let cachedUserData = null;

// Initialize or get user data
function getUserData() {
    if (cachedUserData) return cachedUserData;
    
    let user = localStorage.getItem('dyslexAIUser');
    if (!user) {
        user = {
            username: 'Guest',
            totalGames: 0,
            totalScore: 0,
            totalTime: 0,
            totalCorrect: 0,
            totalAttempts: 0,
            gameStats: {
                game1: { plays: 0, correct: 0, attempts: 0, avgTime: 0, bestScore: 0 },
                game2: { plays: 0, correct: 0, attempts: 0, avgTime: 0, bestScore: 0 },
                game3: { plays: 0, correct: 0, attempts: 0, avgTime: 0, bestScore: 0 },
                game4: { plays: 0, correct: 0, attempts: 0, avgTime: 0, bestScore: 0 },
                game5: { plays: 0, correct: 0, attempts: 0, avgTime: 0, bestScore: 0 }
            },
            history: []
        };
        localStorage.setItem('dyslexAIUser', JSON.stringify(user));
    } else {
        user = JSON.parse(user);
    }
    
    cachedUserData = user;
    return user;
}

// Save game results with optimized storage
function saveGameResult(gameId, result) {
    const user = getUserData();
    const now = new Date();
    
    // Update general stats
    user.totalGames++;
    user.totalScore += result.score || 0;
    user.totalTime += result.timeSpent || 0;
    user.totalCorrect += result.isCorrect ? 1 : 0;
    user.totalAttempts++;
    
    // Update game-specific stats
    const gameStats = user.gameStats[gameId];
    gameStats.plays++;
    gameStats.attempts++;
    if (result.isCorrect) gameStats.correct++;
    gameStats.avgTime = ((gameStats.avgTime * (gameStats.plays - 1)) + (result.timeSpent || 0)) / gameStats.plays;
    if ((result.score || 0) > gameStats.bestScore) gameStats.bestScore = result.score;
    
    // Limit history size to 50 entries to prevent bloating
    if (user.history.length >= 50) {
        user.history.shift(); // Remove oldest entry
    }
    user.history.push({
        gameId,
        timestamp: now.toISOString(),
        ...result
    });
    
    // Save to localStorage with debouncing
    debouncedSaveUserData(user);
}

// Debounce the save operation to prevent rapid successive writes
let saveTimeout = null;
function debouncedSaveUserData(user) {
    cachedUserData = user;
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('dyslexAIUser', JSON.stringify(user));
        saveTimeout = null;
    }, 500); // Save after 500ms of inactivity
}

// Calculate accuracy percentage
function calculateAccuracy(correct, attempts) {
    return attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
}
