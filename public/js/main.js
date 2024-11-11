function updateMaxScores() {
    const games = ["2048", "snake", "tetris", "templeEscape"];

    games.forEach(game => {
        const maxScore = localStorage.getItem(`max-score-${game}`) || "0";
        document.getElementById(`max-score-${game}`).textContent = maxScore;
    });
}

updateMaxScores();