/// <reference path="../../libs/phaser/phaser.d.ts" />
/// <reference path="../../libs/phaser/p2.d.ts" />
/// <reference path="../../libs/phaser/pixi.d.ts" />
/// <reference path="../../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
var IsoExample2 = (function () {
    function IsoExample2() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    IsoExample2.prototype.preload = function () {
        // setup phaser
        this.game.time.advancedTiming = true;
        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);
        this.iso.projector.anchor.setTo(0.5, 0.2);
        //this.game.load.image('tile', '../../assets/tile.png');
        this.game.load.atlasXML('landscape', 'assets/landscapeTiles_sheet.png', 'assets/landscapeTiles_sheet.xml');
    };
    IsoExample2.prototype.create = function () {
        this.isoGroup = this.game.add.group();
        this.currentFrame = 67;
        this.maxFrames = 132;
        // spawn the tiles
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // create a tile using the new isoSprite factory method
                tile = this.iso.addIsoSprite(xx, yy, 0, 'landscape', 1, this.isoGroup);
                tile.anchor.setTo(0.5, 0);
            }
        }
        // provide a 3d position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
        // sprite changer
        var keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        keySpace.onDown.add(this.changeTile, this);
    };
    IsoExample2.prototype.update = function () {
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
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                this.game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        }, this);
    };
    IsoExample2.prototype.render = function () {
        this.game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
        this.game.debug.text(String(this.game.time.fps) || '---', 2, 14, "#a7aebe");
        this.game.debug.text("Frame: " + String(this.currentFrame), 2, 50, '#a7aebe');
    };
    IsoExample2.prototype.changeTile = function () {
        this.currentFrame++;
        if (this.currentFrame > this.maxFrames)
            this.currentFrame = 0;
        this.isoGroup.forEach(function (tile) {
            tile.frame = this.currentFrame;
        }, this);
    };
    return IsoExample2;
})();
window.onload = function () {
    var game = new IsoExample2();
};
//# sourceMappingURL=isoexample.js.map