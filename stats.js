// stats.js
document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('statsContainer');
    const modal = document.getElementById('notesModal');
    const closeBtn = document.querySelector('.close');

    function displayStats() {
        const stats = JSON.parse(localStorage.getItem('gameStats')) || {};
        const games = JSON.parse(localStorage.getItem('games')) || [];

        games.forEach(game => {
            const gameStats = stats[game.id.toString()];
            if (gameStats && Object.keys(gameStats.wins).length > 0) {
                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game-stats');

                const gameTitle = document.createElement('h2');
                gameTitle.textContent = `${game.teamOne} vs ${game.teamTwo} (${game.category})`;
                gameDiv.appendChild(gameTitle);

                Object.entries(gameStats.wins).forEach(([winner, wins]) => {
                    const winButton = document.createElement('button');
                    winButton.textContent = `${winner}: ${wins} wins`;
                    winButton.classList.add('win-button');
                    winButton.addEventListener('click', () => showNotes(game.id, winner));
                    gameDiv.appendChild(winButton);
                });

                statsContainer.appendChild(gameDiv);
            }
        });
    }

    function showNotes(gameId, winner) {
        const stats = JSON.parse(localStorage.getItem('gameStats')) || {};
        const gameStats = stats[gameId.toString()];
        const notes = gameStats.notes[winner] || [];

        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '';

        if (notes.length === 0) {
            notesContainer.textContent = 'No notes available for this winner.';
        } else {
            notes.forEach(note => {
                const noteElem = document.createElement('p');
                noteElem.textContent = note;
                notesContainer.appendChild(noteElem);
            });
        }

        modal.style.display = 'block';
    }

    displayStats();

    // Close modal when clicking on x
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});