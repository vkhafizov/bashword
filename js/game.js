class Game {
  constructor() {
      this.word = "";
      this.attempts = [];
      this.currentAttempt = "";
      this.maxAttempts = 6;
      this.isGameOver = false;
      this.init();
  }

  init() {
      const savedState = GameStorage.load();
      if (savedState) {
          Object.assign(this, savedState);
      } else {
          this.word = DICTIONARY.getRandomWord();
      }
      this.render();
  }

  addLetter(letter) {
      if (this.currentAttempt.length < this.word.length && !this.isGameOver) {
          this.currentAttempt += letter;
          this.render();
      }
  }

  removeLetter() {
      if (this.currentAttempt.length > 0) {
          this.currentAttempt = this.currentAttempt.slice(0, -1);
          this.render();
      }
  }

  submitAttempt() {
      if (this.currentAttempt.length !== this.word.length) return;
      if (!DICTIONARY.isValidWord(this.currentAttempt)) {
          this.showMessage("Һүҙлектә юҡ!");
          return;
      }

      this.attempts.push(this.currentAttempt);
      
      if (this.currentAttempt.toLowerCase() === this.word.toLowerCase()) {
          this.isGameOver = true;
          this.showMessage("Дөрөҫ!");
      } else if (this.attempts.length >= this.maxAttempts) {
          this.isGameOver = true;
          this.showMessage(`Уйын бөттө! Һүҙ: ${this.word}`);
      }

      this.currentAttempt = "";
      this.saveState();
      this.render();
  }

  showMessage(text) {
      const message = document.createElement("div");
      message.className = "message";
      message.textContent = text;
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 2000);
  }

  saveState() {
      GameStorage.save({
          word: this.word,
          attempts: this.attempts,
          currentAttempt: this.currentAttempt,
          isGameOver: this.isGameOver
      });
  }

  render() {
      const board = document.getElementById("board");
      board.innerHTML = "";

      for (let i = 0; i < this.maxAttempts; i++) {
          const row = document.createElement("div");
          row.className = "row";

          const attempt = i < this.attempts.length ? this.attempts[i] 
                      : i === this.attempts.length ? this.currentAttempt 
                      : "";

          for (let j = 0; j < this.word.length; j++) {
              const tile = document.createElement("div");
              tile.className = "tile";
              
              if (attempt[j]) {
                  tile.textContent = attempt[j];
                  if (i < this.attempts.length) {
                      if (attempt[j].toLowerCase() === this.word[j].toLowerCase()) {
                          tile.classList.add("correct");
                      } else if (this.word.toLowerCase().includes(attempt[j].toLowerCase())) {
                          tile.classList.add("present");
                      } else {
                          tile.classList.add("absent");
                      }
                  }
              }
              row.appendChild(tile);
          }
          board.appendChild(row);
      }
  }
}
