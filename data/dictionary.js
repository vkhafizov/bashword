const DICTIONARY = {
    words: ['һөйөү', 'китап', 'бәхет', 'илһам'], 
 
    init() {
        fetch('data/dictionary.txt')
            .then(response => response.text())
            .then(text => {
                this.words = text.split('\n').map(word => word.trim());
            })
            .catch(error => console.error('Хата:', error));
    },
 
    isValidWord(word) {
        return this.words.includes(word.toLowerCase());
    },
 
    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }
 };
 
 DICTIONARY.init();
