﻿/// <reference path="../../libs/phaser/phaser.d.ts" />
/// <reference path="../../libs/phaser/p2.d.ts" />
/// <reference path="../../libs/phaser/pixi.d.ts" />
/// <reference path="../../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />

class IsoExample2 {

    game: Phaser.Game;
    iso: Phaser.Plugin.Isometric;

    isoGroup: Phaser.Group;
    cursorPos: Phaser.Plugin.Isometric.Point3;

    currentFrame: number;
    maxFrames: number;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content',
            { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }

    preload() {

        // setup phaser
        this.game.time.advancedTiming = true;

        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);

        this.iso.projector.anchor.setTo(0.5, 0.2);

        //this.game.load.image('tile', '../../assets/tile.png');
        this.game.load.atlasXML('landscape', 'assets/landscapeTiles_sheet.png', 'assets/landscapeTiles_sheet.xml');
    }

    create() {
        this.isoGroup = this.game.add.group();

        this.currentFrame = 67;
        this.maxFrames = 132;

        // spawn the tiles
        var tile: Phaser.Sprite;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // create a tile using the new isoSprite factory method
                tile = this.iso.addIsoSprite(xx, yy, 0, 'landscape', 1, this.isoGroup);
                tile.anchor.setTo(0.5, 0);
            }
        }

        // provide a 3d position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
    }

    update() {

        // sprite changer
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.currentFrame++;
            if (this.currentFrame > this.maxFrames) this.currentFrame = 0;
            this.isoGroup.forEach(function (tile: Phaser.Sprite) {
                tile.frame = this.currentFrame;
            }, this);
        }

        // update cursor position
        // when converting to isometric, we need to specify z-pos manually, as
        // it cannot easily be gotten from 2d position
        this.iso.projector.unproject(this.game.input.activePointer.position, this.cursorPos);

        // loop over the group to find if the 3d position that intersects with any isoSprite bounds
        this.isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
            // if yes, do a little animation and tint change
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                this.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // otherwise revert it back
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                this.game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        }, this);
    }

    render() {
        this.game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
        this.game.debug.text(String(this.game.time.fps) || '---', 2, 14, "#a7aebe");
        this.game.debug.text("Frame: " + String(this.currentFrame), 2, 50, '#a7aebe');
    }
}

window.onload = () => {
    var game = new IsoExample2();
};