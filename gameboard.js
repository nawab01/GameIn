document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.tab');
    const gameList = document.getElementById('gameList');
    const tabWrapper = document.querySelector('.tab-wrapper');

    function getGames() {
        return JSON.parse(localStorage.getItem('games')) || [];
    }

    function getCategories() {
        return JSON.parse(localStorage.getItem('categories')) || ['All', 'FIFA', 'Cards', 'Chess', 'Board Games', '1 v 1\'s', 'Charades', 'Team vs Team'];
    }

    function displayCategories() {
        const categories = getCategories();
        tabWrapper.innerHTML = '';
        categories.forEach((category, index) => {
            const tab = document.createElement('button');
            tab.classList.add('tab');
            if (index === 0) tab.classList.add('active');
            tab.setAttribute('data-category', category.toLowerCase());
            tab.textContent = category;
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                displayGames(category.toLowerCase());
            });
            tabWrapper.appendChild(tab);
        });
    }

    function displayGames(category) {
        gameList.innerHTML = '';
        const games = getGames();
        const filteredGames = category === 'all' ? games : games.filter(game => game.category.toLowerCase() === category);
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

    displayCategories();
    displayGames('all');

    // Implement drag scrolling for category tabs
    let isDown = false;
    let startX;
    let scrollLeft;

    tabWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - tabWrapper.offsetLeft;
        scrollLeft = tabWrapper.scrollLeft;
    });

    tabWrapper.addEventListener('mouseleave', () => {
        isDown = false;
    });

    tabWrapper.addEventListener('mouseup', () => {
        isDown = false;
    });

    tabWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - tabWrapper.offsetLeft;
        const walk = (x - startX) * 3;
        tabWrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    tabWrapper.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - tabWrapper.offsetLeft;
        scrollLeft = tabWrapper.scrollLeft;
    });

    tabWrapper.addEventListener('touchend', () => {
        isDown = false;
    });

    tabWrapper.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - tabWrapper.offsetLeft;
        const walk = (x - startX) * 3;
        tabWrapper.scrollLeft = scrollLeft - walk;
    });
});