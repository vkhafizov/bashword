class Keyboard {
    constructor(game) {
        this.game = game;
        this.keyElements = new Map();
        this.init();
        
        this.game.on('letterStatusesUpdated', ({ letterStatuses }) => {
            this.updateKeyboardColors(letterStatuses);
        });
    }

    init() {
        const keyboard = document.getElementById("keyboard");
        keyboard.innerHTML = "";

        KEYBOARD_LAYOUT.forEach((row, i) => {
            const rowEl = document.createElement("div");
            rowEl.className = "keyboard-row";

            if (i === KEYBOARD_LAYOUT.length - 1) {
                rowEl.appendChild(this.createSpecialKey("enter"));
            }

            row.forEach(key => {
                const button = document.createElement("button");
                button.className = "key";
                button.textContent = key;
                button.addEventListener("click", () => this.game.addLetter(key));
                this.keyElements.set(key.toLowerCase(), button);
                rowEl.appendChild(button);
            });

            if (i === KEYBOARD_LAYOUT.length - 1) {
                rowEl.appendChild(this.createSpecialKey("backspace"));
            }

            keyboard.appendChild(rowEl);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.game.submitAttempt();
            } else if (e.key === "Backspace") {
                this.game.removeLetter();
            } else {
                const key = e.key.toLowerCase();
                if (KEYBOARD_LAYOUT.flat().includes(key)) {
                    this.game.addLetter(key);
                }
            }
        });
    }

    createSpecialKey(type) {
        const key = SPECIAL_KEYS.find(k => k.id === type);
        const button = document.createElement("button");
        button.className = `key key-${type}`;
        button.textContent = key.text;
        if (type === "enter") {
            button.addEventListener("click", () => this.game.submitAttempt());
        } else if (type === "backspace") {
            button.addEventListener("click", () => this.game.removeLetter());
        }
        return button;
    }

    updateKeyboardColors(letterStatuses) {
        this.keyElements.forEach((button, key) => {
            button.classList.remove('correct', 'present', 'absent');
            
            const status = letterStatuses.get(key);
            if (status) {
                button.classList.add(status);
            }
        });
    }
}