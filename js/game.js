class Game {
    constructor() {
        this.word = "";
        this.attempts = [];
        this.currentAttempt = "";
        this.maxAttempts = 6;
        this.isGameOver = false;
        this.eventListeners = new Map();
        this.letterStatuses = new Map();
        this.init();
    }

    init() {
        const savedState = GameStorage.load();
        if (savedState) {
            Object.assign(this, savedState);
            this.letterStatuses = new Map(savedState.letterStatuses || []);
        } else {
            this.word = DICTIONARY.getRandomWord();
        }
        this.render();
        this.emit('gameInit', { word: this.word });
        this.emit('letterStatusesUpdated', { letterStatuses: this.letterStatuses });
    }

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => callback(data));
        }
    }

    addLetter(letter) {
        if (this.currentAttempt.length < this.word.length && !this.isGameOver) {
            this.currentAttempt += letter;
            this.render();
            this.emit('letterAdded', { letter, currentAttempt: this.currentAttempt });
        }
    }

    removeLetter() {
        if (this.currentAttempt.length > 0) {
            const removedLetter = this.currentAttempt.slice(-1);
            this.currentAttempt = this.currentAttempt.slice(0, -1);
            this.render();
            this.emit('letterRemoved', { letter: removedLetter, currentAttempt: this.currentAttempt });
        }
    }

    updateLetterStatuses(attempt) {
        attempt.split('').forEach((letter, index) => {
            const status = this.getLetterStatus(letter, index);
            const currentStatus = this.letterStatuses.get(letter.toLowerCase());
            
            if (!currentStatus || 
                (currentStatus === 'absent' && (status === 'present' || status === 'correct')) ||
                (currentStatus === 'present' && status === 'correct')) {
                this.letterStatuses.set(letter.toLowerCase(), status);
            }
        });
        
        this.emit('letterStatusesUpdated', { letterStatuses: this.letterStatuses });
    }

    submitAttempt() {
        if (this.currentAttempt.length !== this.word.length) {
            this.showMessage("Һүҙ тулы түгел!", "warning");
            return;
        }

        if (!DICTIONARY.isValidWord(this.currentAttempt)) {
            this.showMessage("Һүҙлектә юҡ!", "error");
            this.emit('invalidWord', { attempt: this.currentAttempt });
            return;
        }

        const attemptAnalysis = this.analyzeAttempt(this.currentAttempt);
        this.attempts.push(this.currentAttempt);
        
        this.updateLetterStatuses(this.currentAttempt);

        if (this.currentAttempt.toLowerCase() === this.word.toLowerCase()) {
            this.isGameOver = true;
            this.showMessage("Дөрөҫ!", "success");
            this.emit('gameWon', { attempts: this.attempts.length });
            setTimeout(() => this.reset(), 9000);
        } else if (this.attempts.length >= this.maxAttempts) {
            this.isGameOver = true;
            this.showMessage(`Уйын бөттө! Һүҙ: ${this.word}`, "info");
            this.emit('gameLost', { word: this.word });
            setTimeout(() => this.reset(), 9000);
        }

        this.currentAttempt = "";
        this.saveState();
        this.render();
        this.emit('attemptSubmitted', { attempt: attemptAnalysis });
    }

    analyzeAttempt(attempt) {
        return attempt.split('').map((letter, index) => ({
            letter,
            status: this.getLetterStatus(letter, index)
        }));
    }

    getLetterStatus(letter, position) {
        if (letter.toLowerCase() === this.word[position].toLowerCase()) {
            return 'correct';
        }
        if (this.word.toLowerCase().includes(letter.toLowerCase())) {
            return 'present';
        }
        return 'absent';
    }

    showMessage(text, type = 'info') {
        const message = document.createElement("div");
        message.className = `message message-${type}`;
        message.textContent = text;
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2500);
        this.emit('messageShown', { text, type });
    }

    saveState() {
        const state = {
            word: this.word,
            attempts: this.attempts,
            currentAttempt: this.currentAttempt,
            isGameOver: this.isGameOver,
            letterStatuses: Array.from(this.letterStatuses.entries())
        };
        GameStorage.save(state);
        this.emit('stateSaved', state);
    }

    render() {
        const board = document.getElementById("board");
        board.innerHTML = "";
        for (let i = 0; i < this.maxAttempts; i++) {
            const row = this.createRow(i);
            board.appendChild(row);
        }
        this.emit('boardRendered', {
            attempts: this.attempts,
            currentAttempt: this.currentAttempt
        });
    }

    createRow(rowIndex) {
        const row = document.createElement("div");
        row.className = "row";
        const attempt = rowIndex < this.attempts.length ? this.attempts[rowIndex] :
                       rowIndex === this.attempts.length ? this.currentAttempt : "";
        for (let j = 0; j < this.word.length; j++) {
            const tile = this.createTile(attempt, j, rowIndex);
            row.appendChild(tile);
        }
        return row;
    }

    createTile(attempt, position, rowIndex) {
        const tile = document.createElement("div");
        tile.className = "tile";
        if (attempt[position]) {
            tile.textContent = attempt[position];
            if (rowIndex < this.attempts.length) {
                tile.classList.add(this.getLetterStatus(attempt[position], position));
            }
        }
        return tile;
    }

    getStatistics() {
        return {
            gamesPlayed: this.attempts.length > 0 ? 1 : 0,
            currentStreak: this.isGameOver && !this.hasLost() ? 1 : 0,
            averageAttempts: this.attempts.length,
            winPercentage: this.hasWon() ? 100 : 0
        };
    }

    hasWon() {
        return this.isGameOver && this.attempts[this.attempts.length - 1].toLowerCase() === this.word.toLowerCase();
    }

    hasLost() {
        return this.isGameOver && !this.hasWon();
    }

    reset() {
        this.word = DICTIONARY.getRandomWord();
        this.attempts = [];
        this.currentAttempt = "";
        this.isGameOver = false;
        this.letterStatuses.clear();
        this.saveState();
        this.render();
        this.emit('gameReset', { word: this.word });
        this.emit('letterStatusesUpdated', { letterStatuses: this.letterStatuses });
    }
}