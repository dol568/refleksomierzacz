const clickArea = document.getElementById('click-area');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const numAttemptsInput = document.getElementById('num-attempts');
const clicksBeforeColorChangeInput = document.getElementById('clicks-before-color-change');
const gameModeSelect = document.getElementById('game-mode');
const statsContainer = document.getElementById('stats-container');
const shortestTimeSpan = document.getElementById('shortest-time');
const longestTimeSpan = document.getElementById('longest-time');
const averageTimeSpan = document.getElementById('average-time');
const bestScoreSpan = document.getElementById('best-score');

let colorTimer;
let clickTimer;
let numAttempts;
let clicksBeforeColorChange;
let gameMode;
let scores = [];

function startGame() {
    numAttempts = parseInt(numAttemptsInput.value);
    clicksBeforeColorChange = parseInt(clicksBeforeColorChangeInput.value);
    gameMode = gameModeSelect.value;
    scores = [];
    startButton.disabled = true;
    stopButton.disabled = false;
    statsContainer.hidden = true;
    clickArea.style.backgroundColor = '#CCC';
    stopButton.classList.remove('disabled');
    startButton.classList.add('disabled');
    if (gameMode === 'click') {
        clickArea.addEventListener('click', handleColorChange);
    } else if (gameMode === 'keypress') {
        document.addEventListener('keypress', handleColorChange);
    }
    nextColorChange();
}

function stopGame() {
    clearInterval(colorTimer);
    clearTimeout(clickTimer);
    startButton.disabled = false;
    stopButton.disabled = true;
    stopButton.classList.add('disabled');
    startButton.classList.remove('disabled');
    if (gameMode === 'click') {
        clickArea.removeEventListener('click', handleColorChange);
    } else if (gameMode === 'keypress') {
        document.removeEventListener('keypress', handleColorChange);
    }
    showStats();
}

function handleColorChange() {
    clearTimeout(clickTimer);
    const reactionTime = Date.now() - colorTimer;
    scores.push(reactionTime);
    if (scores.length < numAttempts) {
        nextColorChange();
    } else {
        stopGame();
    }
}

function nextColorChange() {
    const delay = getRandomDelay();
    colorTimer = setTimeout(() => {
        clickArea.style.backgroundColor = getRandomColor();
        clickTimer = setTimeout(handleColorChange, 5000);
    }, delay);
}

function getRandomDelay() {
    const minDelay = 1000 / clicksBeforeColorChange;
    const maxDelay = 5000;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgba(${red},${green},${blue})`;
}

function calculateShortestTime() {
    return Math.min(...scores);
}

function calculateLongestTime() {
    return Math.max(...scores);
}

function calculateAverageTime() {
    return scores.reduce((total, score) => total + score, 0) / scores.length;
}

function showStats() {
    statsContainer.hidden = false;
    shortestTimeSpan.textContent = calculateShortestTime();
    longestTimeSpan.textContent = calculateLongestTime();
    averageTimeSpan.textContent = Math.round(calculateAverageTime());
    const bestScore = localStorage.getItem('bestScore');
    if (bestScore === null || calculateShortestTime() < bestScore) {
        localStorage.setItem('bestScore', calculateShortestTime());
    }
    bestScoreSpan.textContent = localStorage.getItem('bestScore');
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);