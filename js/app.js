document.addEventListener("DOMContentLoaded", () => {
  window.game = new Game();
  const keyboard = new Keyboard(window.game);
  
  const resultButton = document.querySelector('.result-button');
  resultButton.addEventListener('click', (e) => {
    e.preventDefault();
    const gameStats = {
      word: window.game.word,
      attempts: window.game.attempts.length,
      time: Math.floor((Date.now() - window.game.startTime) / 1000),
      history: window.game.attempts
    };
    window.location.href = `result.html?word=${gameStats.word}&attempts=${gameStats.attempts}&time=${gameStats.time}&history=${encodeURIComponent(JSON.stringify(gameStats.history))}`;
  });
});
