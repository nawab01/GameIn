document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('gameId'));

    const gameInfo = document.getElementById('gameInfo');
    const teamOneStats = document.getElementById('teamOneStats');
    const teamTwoStats = document.getElementById('teamTwoStats');
    const backToGameLink = document.getElementById('backToGame');

    console.log('Game ID from URL:', gameId); // Debugging: Log the game ID from URL

    // Set up the back link functionality
    backToGameLink.addEventListener('click', () => {
        localStorage.setItem('currentGameId', gameId);
        window.location.href = 'gameboard.html';
    });

    function loadGameStats() {
        console.log('Loading game stats...'); // Debugging: Log when function is called
        let games;
        try {
            games = JSON.parse(localStorage.getItem('games')) || [];
            console.log('All games:', games); // Debugging: Log all games
        } catch (error) {
            console.error('Error parsing games from localStorage:', error);
            games = [];
        }

        const game = games.find(g => g.id === gameId);
        console.log('Found game:', game); // Debugging: Log the found game

        if (game) {
            displayGameInfo(game);
            displayTeamStats(game, 'One');
            displayTeamStats(game, 'Two');
        } else {
            gameInfo.textContent = 'Game not found';
            console.error('Game not found for ID:', gameId); // Debugging: Log error if game not found
        }
    }

    function displayGameInfo(game) {
        console.log('Displaying game info:', game); // Debugging: Log the game being displayed
        gameInfo.innerHTML = `
            <p>Category: ${game.category}</p>
            <p>Score: ${game.teamOne} ${game.scoreOne} - ${game.scoreTwo} ${game.teamTwo}</p>
        `;
        teamOneStats.querySelector('h2').textContent = game.teamOne;
        teamTwoStats.querySelector('h2').textContent = game.teamTwo;
    }

    function displayTeamStats(game, team) {
        console.log(`Displaying stats for team ${team}:`, game); // Debugging: Log the team and game data
        const container = team === 'One' ? teamOneStats : teamTwoStats;
        const buttonContainer = container.querySelector('.buttonContainer');
        buttonContainer.innerHTML = '';

        const score = team === 'One' ? game.scoreOne : game.scoreTwo;
        const buttonStates = team === 'One' ? game.buttonStates.slice(0, 5) : game.buttonStates.slice(5);
        const notes = team === 'One' ? game.notes.slice(0, 5) : game.notes.slice(5);

        console.log(`Team ${team} score:`, score); // Debugging: Log the score

        for (let i = 0; i < 5; i++) {
            const button = document.createElement('div');
            button.className = i < score ? 'statButton active' : 'statButton';
            button.setAttribute('data-index', i);
            buttonContainer.appendChild(button);

            if (notes[i]) {
                const noteElement = document.createElement('div');
                noteElement.className = 'statNote';
                noteElement.textContent = notes[i].substring(0, 10) + (notes[i].length > 10 ? '...' : '');
                noteElement.title = notes[i];
                button.appendChild(noteElement);
            }

            button.addEventListener('click', () => showNoteHistory(game, team, i));
        }
    }

    function showNoteHistory(game, team, index) {
        console.log(`Showing note history for team ${team}, button ${index}`); // Debugging: Log when showing note history
        const buttonIndex = team === 'One' ? index : index + 5;
        const notes = game.stats.filter(stat => 
            stat.team === team && stat.buttonIndex === index
        ).map(stat => ({
            timestamp: new Date(stat.timestamp).toLocaleString(),
            note: stat.note
        }));

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Note History</h2>
                <ul>
                    ${notes.map(note => `<li>${note.timestamp}: ${note.note || 'No note'}</li>`).join('')}
                </ul>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            modal.remove();
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                modal.remove();
            }
        };
    }

    loadGameStats();
});