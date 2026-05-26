import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Фон
        this.cameras.main.setBackgroundColor('#87ceeb');

        // Заголовок
        this.add.text(width / 2, height / 3, 'Висотобоязнь', {
            fontSize: '48px',
            fill: '#000',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Підзаголовок
        this.add.text(width / 2, height / 2 - 40, 'Він боїться висоти гірше голуба!', {
            fontSize: '24px',
            fill: '#333',
        }).setOrigin(0.5);

        // Рекорд
        const bestScore = localStorage.getItem('bestScore') || 0;
        this.add.text(width / 2, height / 2 + 40, `Ваш рекорд: ${bestScore}`, {
            fontSize: '18px',
            fill: '#666',
        }).setOrigin(0.5);

        // Кнопка Грати
        const playButton = this.add.text(width / 2, height * 0.7, 'Грати', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#00aaff',
            padding: { x: 20, y: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Game'));

        playButton.on('pointerover', () => {
            playButton.setFill('#ffff00');
        });

        playButton.on('pointerout', () => {
            playButton.setFill('#fff');
        });
    }
}
