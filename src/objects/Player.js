import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
    }

    moveLeft() {
        this.setVelocityX(-250);
    }

    moveRight() {
        this.setVelocityX(250);
    }

    stop() {
        this.setVelocityX(0);
    }
}
