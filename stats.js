document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('gameId'));

    const gameInfo = document.getElementById('gameInfo');
    const teamOneStats = document.getElementById('teamOneStats');
    const teamTwoStats = document.getElementById('teamTwoStats');

    function loadGameStats() {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        const game = games.find(g => g.id === gameId);

        if (game) {
            displayGameInfo(game);
            displayTeamStats(game, 'One');
            displayTeamStats(game, 'Two');
        } else {
            gameInfo.textContent = 'Game not found';
        }
    }

    function displayGameInfo(game) {
        gameInfo.innerHTML = `
            <p>Category: ${game.category}</p>
            <p>Score: ${game.teamOne} ${game.scoreOne} - ${game.scoreTwo} ${game.teamTwo}</p>
        `;
        teamOneStats.querySelector('h2').textContent = game.teamOne;
        teamTwoStats.querySelector('h2').textContent = game.teamTwo;
    }

    function displayTeamStats(game, team) {
        const container = team === 'One' ? teamOneStats : teamTwoStats;
        const buttonContainer = container.querySelector('.buttonContainer');
        buttonContainer.innerHTML = '';

        const score = team === 'One' ? game.scoreOne : game.scoreTwo;
        const buttonStates = team === 'One' ? game.buttonStates.slice(0, 5) : game.buttonStates.slice(5);
        const notes = team === 'One' ? game.notes.slice(0, 5) : game.notes.slice(5);

        for (let i = 0; i < score; i++) {
            const button = document.createElement('div');
            button.className = 'statButton active';
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