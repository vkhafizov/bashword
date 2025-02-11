const DICTIONARY = {
    words: [],
 
    async init() {
        try {
            const response = await fetch('data/dictionary.txt');
            if (!response.ok) throw new Error('Словарь не найден');
            const text = await response.text();
            this.words = text.split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);
        } catch (error) {
            console.error('Ошибка загрузки словаря:', error);
            // Оставляем изначальные слова если файл не загрузился
            this.words = ['һөйөү', 'китап', 'тырыш', 'ауыл', 'етмеш', 'бәхет', 'заман', 'илһам'];
        }
    },
 
    isValidWord(word) {
        if (!this.words.length) return false;
        return this.words.includes(word.toLowerCase());
    },
 
    getRandomWord() {
        if (!this.words.length) return 'китап';
        return this.words[Math.floor(Math.random() * this.words.length)];
    }
 };
 
 // Инициализируем словарь до запуска игры
 (async () => {
    await DICTIONARY.init();
    const game = new Game();
    const keyboard = new Keyboard(game);
 })();
