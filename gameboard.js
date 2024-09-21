document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.tab');
    const gameList = document.getElementById('gameList');
    const tabWrapper = document.querySelector('.tab-wrapper');

    function getGames() {
        return JSON.parse(localStorage.getItem('games')) || [];
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            displayGames(category);
        });
    });

    function displayGames(category) {
        gameList.innerHTML = '';
        const games = getGames();
        const filteredGames = category === 'all' ? games : games.filter(game => game.category === category);
        filteredGames.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('gameItem');
            gameElement.textContent = `${game.teamOne} vs ${game.teamTwo} - ${game.scoreOne}:${game.scoreTwo}`;
            gameElement.addEventListener('click', () => loadGame(game.id));
            gameList.appendChild(gameElement);
        });
    }

    function loadGame(gameId) {
        localStorage.setItem('currentGameId', gameId);
        window.location.href = 'index.html';
    }

    displayGames('all');

    let startX;
    let scrollLeft;

    tabWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - tabWrapper.offsetLeft;
        scrollLeft = tabWrapper.scrollLeft;
    });

    tabWrapper.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - tabWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        tabWrapper.scrollLeft = scrollLeft - walk;
    });

    tabWrapper.addEventListener('touchend', () => {
        startX = null;
    });
});