/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
/// <reference path="../src/states/Preload.ts" />

class IsoGame {

    game: Phaser.Game;
    iso: Phaser.Plugin.Isometric;
    roads: any;
    tiles: any;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }

    preload() {

        // setup advanced settings
        this.game.time.advancedTiming = true;
        this.game.debug.renderShadow = false;
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.smoothed = false;

        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.iso.projector.anchor.setTo(0.5, 0.1);
        //this.game.iso.anchor.setTo(0.5, 0.1);
        this.game.renderer.renderSession.roundPixels = true;

        // Game States
        this.game.state.add('boot', 'Boot');
        this.game.state.add('gameover', 'GameOver');
        this.game.state.add('menu', 'Menu');
        //this.game.state.add('play', 'Play');
        this.game.state.add('preload', new Preload());
    }

    create() {
        this.game.state.start('preload');
    }
}

window.onload = () => {
    var game = new IsoGame();
};