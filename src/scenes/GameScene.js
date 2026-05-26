import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Фон
        this.cameras.main.setBackgroundColor('#87ceeb');

        // Гравець
        this.player = this.add.rectangle(width / 2, height - 50, 40, 40, 0xff0000);
        this.physics.world.enable(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setBounce(0.2);

        // Керування
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Сенсорне керування
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.handleTouchMove(pointer, width);
            }
        });

        // Гра змінні
        this.score = 0;
        this.lives = 5;
        this.spawnRate = 1;
        this.fallSpeed = 200;
        this.fallingObjects = this.physics.add.group();

        // Таймер для спавну
        this.spawnTimer = 0;
        this.spawnInterval = 1000 / this.spawnRate;

        // HUD текст
        this.scoreText = this.add.text(10, 10, `Очки: 0`, {
            fontSize: '20px',
            fill: '#000',
        });

        this.livesText = this.add.text(width - 150, 10, `❤️ ${this.lives}`, {
            fontSize: '20px',
            fill: '#f00',
        });

        // Зіткнення з падаючими об'єктами
        this.physics.add.overlap(this.player, this.fallingObjects, this.hitObject, null, this);

        console.log('GameScene started');
    }

    handleTouchMove(pointer, width) {
        if (pointer.x < width / 2) {
            this.player.body.setVelocityX(-250);
        } else {
            this.player.body.setVelocityX(250);
        }
    }

    update(time, delta) {
        // Керування гравцем
        this.player.body.setVelocityX(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.body.setVelocityX(-250);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.body.setVelocityX(250);
        }

        // Спавн об'єктів
        this.spawnTimer += delta;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnFallingObject();
            this.spawnTimer = 0;
        }

        // Видалення об'єктів за межами екрана
        this.fallingObjects.children.entries.forEach((obj) => {
            if (obj.y > this.cameras.main.height + 50) {
                obj.destroy();
            }
        });
    }

    spawnFallingObject() {
        const { width, height } = this.cameras.main;

        // Ймовірність: 50% лепьоха, 35% голуб, 15% монтажник
        const rand = Math.random();
        let type;
        if (rand < 0.5) type = 'poop';
        else if (rand < 0.85) type = 'pigeon';
        else type = 'mountaineer';

        const x = Phaser.Math.Between(30, width - 30);
        const y = -20;

        const rect = this.add.rectangle(x, y, 30, 30, this.getObjectColor(type));
        this.physics.world.enable(rect);
        rect.body.setVelocityY(this.fallSpeed);
        rect.type = type;
        rect.body.setDrag(0);

        this.fallingObjects.add(rect);
    }

    getObjectColor(type) {
        switch (type) {
            case 'poop':
                return 0xffffff; // білий
            case 'pigeon':
                return 0x808080; // сірий
            case 'mountaineer':
                return 0xffa500; // помаранчевий
            default:
                return 0x000000;
        }
    }

    hitObject(player, obj) {
        switch (obj.type) {
            case 'poop':
                this.lives--;
                this.tweens.add({
                    targets: this.player,
                    alpha: 0.5,
                    duration: 500,
                    yoyo: true,
                });
                console.log(`Влучила лепьоха! Життів залишилось: ${this.lives}`);
                break;
            case 'pigeon':
                this.score += 10;
                console.log(`Спійманий голуб! Очки: ${this.score}`);
                break;
            case 'mountaineer':
                this.score += 50;
                this.tweens.add({
                    targets: this.player,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 300,
                    yoyo: true,
                });
                console.log(`Спійманий монтажник! Очки: ${this.score}`);
                break;
        }

        obj.destroy();
        this.updateHUD();
        this.adjustDifficulty();

        if (this.lives <= 0) {
            this.saveScore();
            this.scene.start('GameOver', { finalScore: this.score });
        }
    }

    adjustDifficulty() {
        if (this.score > 0 && this.score % 100 === 0) {
            this.spawnRate = Math.min(3, this.spawnRate + 0.1);
            this.fallSpeed = Math.min(400, this.fallSpeed + 10);
            this.spawnInterval = 1000 / this.spawnRate;
            console.log(`Складність зросла! Спавн: ${this.spawnRate.toFixed(1)}, Швидкість: ${this.fallSpeed}`);
        }
    }

    updateHUD() {
        this.scoreText.setText(`Очки: ${this.score}`);
        this.livesText.setText(`❤️ ${this.lives}`);
    }

    saveScore() {
        const bestScore = Math.max(parseInt(localStorage.getItem('bestScore') || 0), this.score);
        localStorage.setItem('bestScore', bestScore);
    }
}
