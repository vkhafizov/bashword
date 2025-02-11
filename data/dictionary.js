const DICTIONARY = {
    words: null,

    async init() {
        try {
            const response = await fetch('data/dictionary.txt');
            const text = await response.text();
            this.words = text.split('\n').map(word => word.trim());
        } catch (error) {
            // Если загрузка не удалась, используем резервные слова
            this.words = ['һөйөү', 'китап', 'аҡҡош', 'әйбер', 'тырыш', 'бәхет'];
        }
    },

    isValidWord(word) {
        return this.words?.includes(word.toLowerCase());
    },

    getRandomWord() {
        return this.words?.[Math.floor(Math.random() * this.words.length)];
    }
};

await DICTIONARY.init();
