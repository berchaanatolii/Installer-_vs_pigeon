import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.finalScore = data.finalScore || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Фон
        this.cameras.main.setBackgroundColor('#000');

        // Заголовок
        this.add.text(width / 2, height / 3, 'Гру закінчено!', {
            fontSize: '48px',
            fill: '#fff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Рахунок
        this.add.text(width / 2, height / 2 - 40, `Ваш рахунок: ${this.finalScore}`, {
            fontSize: '32px',
            fill: '#ffff00',
        }).setOrigin(0.5);

        // Рекорд
        const bestScore = localStorage.getItem('bestScore') || 0;
        const isNewRecord = this.finalScore >= parseInt(bestScore);
        const recordText = isNewRecord ? '🏆 НОВИЙ РЕКОРД! 🏆' : `Найкращий рахунок: ${bestScore}`;
        this.add.text(width / 2, height / 2 + 20, recordText, {
            fontSize: '20px',
            fill: isNewRecord ? '#ffff00' : '#aaa',
        }).setOrigin(0.5);

        // Кнопка "Спробувати знову"
        const retryButton = this.add.text(width / 2, height * 0.65, 'Спробувати знову', {
            fontSize: '28px',
            fill: '#fff',
            backgroundColor: '#00ff00',
            padding: { x: 20, y: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Game'));

        retryButton.on('pointerover', () => {
            retryButton.setFill('#ffff00');
        });

        retryButton.on('pointerout', () => {
            retryButton.setFill('#fff');
        });

        // Кнопка "На головну"
        const menuButton = this.add.text(width / 2, height * 0.8, 'На головну', {
            fontSize: '28px',
            fill: '#fff',
            backgroundColor: '#ff6600',
            padding: { x: 20, y: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Menu'));

        menuButton.on('pointerover', () => {
            menuButton.setFill('#ffff00');
        });

        menuButton.on('pointerout', () => {
            menuButton.setFill('#fff');
        });
    }
}
