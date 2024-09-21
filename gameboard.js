document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.tab');
    const gameList = document.getElementById('gameList');
    const tabWrapper = document.querySelector('.tab-wrapper');

    let games = [
        { id: 1, name: "Atif/Bali Vs Nahal/Ifi", category: "cards" },
        { id: 2, name: "Aman Vs Nawab", category: "fifa" },
        { id: 3, name: "Chess Tournament 2023", category: "chess" },
        { id: 4, name: "Monopoly Night", category: "boardgames" },
        { id: 5, name: "Street Fighter Tournament", category: "1v1" },
        { id: 6, name: "Family Charades", category: "charades" },
        { id: 7, name: "Football Match: Red vs Blue", category: "teamvsteam" }
    ];

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
        const filteredGames = category === 'all' ? games : games.filter(game => game.category === category);
        filteredGames.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('gameItem');
            gameElement.textContent = game.name;
            gameList.appendChild(gameElement);
        });
    }

    // Initially display all games
    displayGames('all');

    // Add touch swiping functionality
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