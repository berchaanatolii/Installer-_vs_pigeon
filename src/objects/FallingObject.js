import Phaser from 'phaser';

export default class FallingObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, speed) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.type = type;
        this.setVelocityY(speed);
        this.setDisplaySize(30, 30);
        this.setFillStyle(this.getColor(type));
    }

    getColor(type) {
        switch (type) {
            case 'poop':
                return 0xffffff;
            case 'pigeon':
                return 0x808080;
            case 'mountaineer':
                return 0xffa500;
            default:
                return 0x000000;
        }
    }
}
