// Initialize or get user data
function getUserData() {
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
    }
    return JSON.parse(user);
}

// Save game results
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
    
    // Add to history
    user.history.push({
        gameId,
        timestamp: now.toISOString(),
        ...result
    });
    
    localStorage.setItem('dyslexAIUser', JSON.stringify(user));
}

// Calculate accuracy percentage
function calculateAccuracy(correct, attempts) {
    return attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
}
