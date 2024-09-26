// config.js
const config = {
    initialCategories: ['All', 'FIFA', 'Cards', 'Chess', 'Board Games', '1 v 1\'s', 'Charades', 'Team vs Team']
};

// domElements.js
const domElements = {
    teamOne: document.getElementById('teamOne'),
    firstPlayer: document.getElementById('firstPlayer'),
    teamTwo: document.getElementById('teamTwo'),
    appContainer: document.getElementById('appContainer'),
    secondPlayer: document.getElementById('secondPlayer'),
    scoreOneDisplay: document.getElementById('scoreOne'),
    scoreTwoDisplay: document.getElementById('scoreTwo'),
    modal: document.getElementById('noteModal'),
    closeBtn: document.getElementsByClassName('close')[0],
    noteText: document.getElementById('noteText'),
    saveNoteBtn: document.getElementById('saveNote'),
    buttonDivOne: document.getElementById('buttonDivOne'),
    buttonDivTwo: document.getElementById('buttonDivTwo'),
    categoryInput: document.getElementById('categoryInput'),
    categoryButton: document.getElementById('categoryButton'),
    categoryList: document.getElementById('categoryList'),
    refreshOne: document.getElementById('refreshOne'),
    refreshTwo: document.getElementById('refreshTwo'),
    resetButton: document.getElementById('resetButton'),
    buttonSubmit: document.getElementById('buttonSubmit')
};

// gameState.js
const gameState = {
    currentButton: null,
    scoreOne: 0,
    scoreTwo: 0,
    totalScoreOne: 0,
    totalScoreTwo: 0,
    currentGameId: null,
    gameStats: []
};

// storage.js
const storage = {
    saveGame() {
        if (gameState.currentGameId) {
            const game = {
                id: gameState.currentGameId,
                teamOne: domElements.teamOne.value,
                teamTwo: domElements.teamTwo.value,
                category: domElements.categoryInput.value,
                scoreOne: gameState.totalScoreOne,
                scoreTwo: gameState.totalScoreTwo,
                buttonStates: gameBoard.getStates(),
                notes: gameBoard.getNotes(),
                stats: gameState.gameStats
            };
            let games = JSON.parse(localStorage.getItem('games')) || [];
            const index = games.findIndex(g => g.id === game.id);
            if (index !== -1) {
                games[index] = game;
            } else {
                games.push(game);
            }
            localStorage.setItem('games', JSON.stringify(games));
        }
    },
    loadGame(gameId) {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        return games.find(g => g.id === parseInt(gameId));
    },
    saveCategories(categories) {
        localStorage.setItem('categories', JSON.stringify(categories));
    },
    loadCategories() {
        return JSON.parse(localStorage.getItem('categories')) || config.initialCategories;
    }
};

// gameBoard.js
const gameBoard = {
    create() {
        for (let i = 0; i < 5; i++) {
            this.createButton('One');
            this.createButton('Two');
        }
        this.addEventListeners();
    },
    createButton(team) {
        const button = document.createElement('button');
        button.className = `buttons${team}`;
        button.setAttribute('data-state', '0');
        domElements[`buttonDiv${team}`].appendChild(button);
    },
    addEventListeners() {
        const addButtons = (team) => {
            document.querySelectorAll(`.buttons${team}`).forEach(button => {
                button.addEventListener('click', () => this.addCourt(button, team));
                button.addEventListener('dblclick', noteModal.open);
            });
        };
        addButtons('One');
        addButtons('Two');
    },
    addCourt(button, team) {
        if (button.classList.contains('note-cloud') || button.querySelector('.note-cloud')) {
            return;
        }

        const currentState = parseInt(button.getAttribute('data-state'));
        button.style.backgroundColor = currentState % 2 === 0 ? 'rgb(0, 255, 255)' : 'rgb(240, 240, 240)';
        button.setAttribute('data-state', (currentState + 1) % 2);

        const note = button.querySelector('.note-cloud')?.title || '';
        if (note.trim() !== '') {
            const buttonIndex = Array.from(button.parentNode.children).indexOf(button);
            gameState.gameStats.push({
                timestamp: Date.now(),
                team: team,
                buttonIndex: buttonIndex,
                state: button.getAttribute('data-state'),
                note: note
            });
        }

        score.check(team);
        storage.saveGame(); // Save state after each button press
    },
    clear(team) {
        document.querySelectorAll(`.buttons${team}`).forEach(button => {
            const noteCloud = button.querySelector('.note-cloud');
            if (noteCloud) {
                noteCloud.remove();
            }
            button.style.backgroundColor = 'rgb(240, 240, 240)';
            button.setAttribute('data-state', '0');
        });
        gameState[`score${team}`] = 0;
        score.check(team);
        storage.saveGame(); // Save state after clearing buttons
    },
    getStates() {
        return [...document.querySelectorAll('.buttonsOne'), ...document.querySelectorAll('.buttonsTwo')]
            .map(button => button.getAttribute('data-state'));
    },
    getNotes() {
        return [...document.querySelectorAll('.buttonsOne'), ...document.querySelectorAll('.buttonsTwo')]
            .map(button => button.querySelector('.note-cloud')?.title || '');
    },
    restoreStates(states, notes) {
        const buttons = [...document.querySelectorAll('.buttonsOne'), ...document.querySelectorAll('.buttonsTwo')];
        buttons.forEach((button, index) => {
            button.style.backgroundColor = states[index] === '1' ? 'rgb(0, 255, 255)' : 'rgb(240, 240, 240)';
            button.setAttribute('data-state', states[index]);
            
            if (notes && notes[index]) {
                noteModal.createNoteCloud(button, notes[index]);
            }
        });
    }
};

// score.js
const score = {
    check(team) {
        const buttons = document.querySelectorAll(`.buttons${team}`);
        const colorCount = Array.from(buttons).filter(button => 
            window.getComputedStyle(button).backgroundColor === 'rgb(0, 255, 255)'
        ).length;
        
        gameState[`score${team}`] = colorCount;
        gameState[`totalScore${team}`] = Math.floor(gameState[`totalScore${team}`] / 5) * 5 + colorCount;
        this.updateDisplay(team);
        storage.saveGame(); // Save state after updating score
    },
    updateDisplay(team) {
        domElements[`score${team}Display`].innerText = gameState[`totalScore${team}`];
        domElements[`score${team}Display`].style.display = 'inline-flex';
    },
    reset() {
        gameBoard.clear('One');
        gameBoard.clear('Two');
        gameState.totalScoreOne = 0;
        gameState.totalScoreTwo = 0;
        this.updateDisplay('One');
        this.updateDisplay('Two');
        storage.saveGame(); // Save state after resetting scores
    }
};

// noteModal.js
const noteModal = {
    open(event) {
        event.stopPropagation();
        gameState.currentButton = event.currentTarget;
        const existingNote = gameState.currentButton.querySelector('.note-cloud');
        domElements.noteText.value = existingNote ? existingNote.title : '';
        domElements.modal.style.display = 'block';
    },
    close() {
        domElements.modal.style.display = 'none';
    },
    save() {
        const note = domElements.noteText.value.trim();
        if (note) {
            this.createNoteCloud(gameState.currentButton, note);
            gameState.currentButton.style.backgroundColor = 'rgb(0, 255, 255)';
            gameState.currentButton.setAttribute('data-state', '1');

            const buttonIndex = Array.from(gameState.currentButton.parentNode.children).indexOf(gameState.currentButton);
            const teamIndex = gameState.currentButton.classList.contains('buttonsOne') ? 0 : 1;
            gameState.gameStats.push({
                timestamp: Date.now(),
                team: teamIndex === 0 ? 'One' : 'Two',
                buttonIndex: buttonIndex,
                state: gameState.currentButton.getAttribute('data-state'),
                note: note
            });
        } else {
            const existingNote = gameState.currentButton.querySelector('.note-cloud');
            if (existingNote) {
                existingNote.remove();
                gameState.currentButton.style.backgroundColor = 'rgb(240, 240, 240)';
                gameState.currentButton.setAttribute('data-state', '0');
            }
        }

        this.close();
        score.check(gameState.currentButton.classList.contains('buttonsOne') ? 'One' : 'Two');
        storage.saveGame(); // Save state after updating note
    },
    createNoteCloud(button, note) {
        let noteCloud = button.querySelector('.note-cloud');
        if (!noteCloud) {
            noteCloud = document.createElement('div');
            noteCloud.className = 'note-cloud';
            button.appendChild(noteCloud);
            noteCloud.addEventListener('click', (event) => {
                event.stopPropagation();
                this.open({currentTarget: button, stopPropagation: () => {}});
            });
        }
        noteCloud.textContent = note.substring(0, 10) + (note.length > 10 ? '...' : '');
        noteCloud.title = note;
    }
};

// category.js
const category = {
    populate() {
        const categories = storage.loadCategories();
        domElements.categoryList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => {
                domElements.categoryInput.value = category;
                this.toggleDropdown();
            });
            domElements.categoryList.appendChild(li);
        });
    },
    toggleDropdown() {
        domElements.categoryList.classList.toggle('show');
    },
    add() {
        const newCategory = prompt("Enter a new category:");
        if (newCategory && newCategory.trim()) {
            let categories = storage.loadCategories();
            if (!categories.includes(newCategory)) {
                categories.push(newCategory);
                storage.saveCategories(categories);
                this.populate();
                domElements.categoryInput.value = newCategory;
                alert('New category added successfully!');
            } else {
                alert('This category already exists!');
            }
        }
    }
};

// game.js
const game = {
    init() {
        domElements.appContainer.style.display = 'none';
        this.loadExisting();
        category.populate();
        this.addEventListeners();
    },
    loadExisting() {
        const gameId = localStorage.getItem('currentGameId');
        if (gameId) {
            const game = storage.loadGame(gameId);
            if (game) {
                this.restore(game);
                localStorage.removeItem('currentGameId');
            }
        }
    },
    restore(game) {
        domElements.teamOne.value = game.teamOne;
        domElements.teamTwo.value = game.teamTwo;
        domElements.categoryInput.value = game.category;
        gameState.currentGameId = game.id;
        gameState.totalScoreOne = game.scoreOne;
        gameState.totalScoreTwo = game.scoreTwo;
        gameState.gameStats = game.stats || [];
        this.showPlayer();
        score.updateDisplay('One');
        score.updateDisplay('Two');
        gameBoard.restoreStates(game.buttonStates, game.notes);
    },
    showPlayer() {
        const category = domElements.categoryInput.value.trim();
        if (!domElements.teamOne.value || !domElements.teamTwo.value || !category) {
            alert("Please enter both team names and select a category.");
            return;
        }
        domElements.firstPlayer.innerText = domElements.teamOne.value;
        domElements.secondPlayer.innerText = domElements.teamTwo.value;
        document.getElementById('teamNames').style.display = 'none';
        domElements.appContainer.style.display = 'block';
        gameBoard.create();
        
        if (!gameState.currentGameId) {
            gameState.currentGameId = Date.now();
            storage.saveGame(); // Save initial game state
        }

        this.updateStatsLink();
    },
    updateStatsLink() {
        const existingStatsLink = document.querySelector('.stats-link');
        if (existingStatsLink) {
            existingStatsLink.remove();
        }
        const statsLink = document.createElement('a');
        statsLink.href = `stats.html?gameId=${gameState.currentGameId}`;
        statsLink.textContent = 'stats';
        statsLink.className = 'stats-link';
        domElements.appContainer.appendChild(statsLink);
    },
    addEventListeners() {
        domElements.buttonSubmit.addEventListener('click', () => this.showPlayer());
        domElements.resetButton.addEventListener('click', () => score.reset());
        domElements.refreshOne.addEventListener('click', () => gameBoard.clear('One'));
        domElements.refreshTwo.addEventListener('click', () => gameBoard.clear('Two'));
        domElements.closeBtn.addEventListener('click', () => noteModal.close());
        domElements.saveNoteBtn.addEventListener('click', () => noteModal.save());
        domElements.categoryButton.addEventListener('click', () => category.toggleDropdown());

        window.addEventListener('click', (event) => {
            if (event.target === domElements.modal) {
                noteModal.close();
            }
            if (!event.target.matches('#categoryInput') && !event.target.matches('#categoryButton') && !event.target.matches('#categoryButton svg')) {
                domElements.categoryList.classList.remove('show');
            }
        });

        // Use 'pagehide' event for better iOS compatibility
        window.addEventListener('pagehide', () => storage.saveGame());

        // Use Page Visibility API for additional state saving
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                storage.saveGame();
            }
        });
    }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => game.init());