/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
var IsoGame = (function () {
    function IsoGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    IsoGame.prototype.preload = function () {
        this.game.load.image('logo', 'assets/phaser2.png');
    };
    IsoGame.prototype.create = function () {
        var logo = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    };
    return IsoGame;
})();
window.onload = function () {
    var game = new IsoGame();
};
//# sourceMappingURL=game.js.map