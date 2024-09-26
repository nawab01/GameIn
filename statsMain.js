// In-memory fallback storage
const memoryStorage = new Map();

// Enhanced storage functions with detailed logging and fallback mechanisms
function setStorageItem(key, value) {
    console.log(`Attempting to set ${key} with value:`, value);
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Successfully set ${key} in localStorage`);
    } catch (e) {
        console.error(`Error setting ${key} in localStorage:`, e);
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            console.log(`Successfully set ${key} in sessionStorage`);
        } catch (e2) {
            console.error(`Error setting ${key} in sessionStorage:`, e2);
            memoryStorage.set(key, value);
            console.log(`Set ${key} in memory storage`);
        }
    }
}

function getStorageItem(key) {
    console.log(`Attempting to get ${key}`);
    let value;
    try {
        value = localStorage.getItem(key);
        console.log(`localStorage value for ${key}:`, value);
    } catch (e) {
        console.error(`Error getting ${key} from localStorage:`, e);
        try {
            value = sessionStorage.getItem(key);
            console.log(`sessionStorage value for ${key}:`, value);
        } catch (e2) {
            console.error(`Error getting ${key} from sessionStorage:`, e2);
            value = memoryStorage.get(key);
            console.log(`Memory storage value for ${key}:`, value);
        }
    }
    return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
}

// Periodic storage check function
function startPeriodicStorageCheck(interval = 30000) {
    setInterval(() => {
        console.log('Performing periodic storage check');
        const testKey = 'storageTest';
        const testValue = { test: 'data' };
        
        setStorageItem(testKey, testValue);
        const retrievedValue = getStorageItem(testKey);
        
        if (JSON.stringify(retrievedValue) !== JSON.stringify(testValue)) {
            console.error('Storage check failed: stored and retrieved values do not match');
            // Implement your fallback strategy here
        } else {
            console.log('Storage check passed');
        }
    }, interval);
}

// Function to navigate to stats page with URL parameters
function navigateToStats(gameId, score) {
    const url = `stats.html?gameId=${gameId}&score=${encodeURIComponent(JSON.stringify(score))}`;
    window.location.href = url;
}

// Function to load game data
function loadGameData() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    const scoreFromUrl = urlParams.get('score');

    if (gameId && scoreFromUrl) {
        // If data is in URL, use it
        const score = JSON.parse(decodeURIComponent(scoreFromUrl));
        displayGameData(gameId, score);
    } else {
        // Otherwise, try to get from storage
        const gameData = getStorageItem('currentGame');
        if (gameData) {
            displayGameData(gameData.id, gameData.score);
        } else {
            console.error('No game data found');
            displayError('No game data found');
        }
    }
}

// Function to display game data (implement this according to your UI)
function displayGameData(gameId, score) {
    console.log(`Displaying game data for game ${gameId} with score:`, score);
    // Implement your UI update logic here
}

// Function to display errors (implement this according to your UI)
function displayError(message) {
    console.error(message);
    // Implement your error display logic here
}

// Initialize the app
function initApp() {
    startPeriodicStorageCheck();
    loadGameData();
    
    // Add event listeners and other initialization logic here
}

// Call initApp when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);