import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Тут завантажуємо ресурси (зараз фейк, оскільки немаємо ассетів)
        this.load.setBaseURL('assets/');
    }

    create() {
        // Переходимо до меню
        this.scene.start('Menu');
    }
}
