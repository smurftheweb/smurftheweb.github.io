var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Preload = (function (_super) {
    __extends(Preload, _super);
    function Preload() {
        _super.apply(this, arguments);
        this.ready = false;
    }
    Preload.prototype.preload = function () {
        console.log("preload init");
        this.asset = this.add.sprite(this.stage.width / 2, this.stage.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);
        this.load.atlasXML('landscape', 'assets/landscapeTiles_sheet.png', 'assets/landscapeTiles_sheet.xml');
        this.load.atlasXML('building', 'assets/buildingTiles_sheet.png', 'assets/buildingTiles_sheet.xml');
        this.load.atlasXML('city', 'assets/cityTiles_sheet.png', 'assets/cityTiles_sheet.xml');
    };
    Preload.prototype.create = function () {
        //this.asset.cropEnabled = false; NOT FOUND
    };
    Preload.prototype.update = function () {
        if (!!this.ready) {
            this.game.state.start('boot');
        }
    };
    Preload.prototype.onLoadComplete = function () {
        this.ready = true;
    };
    return Preload;
})(Phaser.State);
//# sourceMappingURL=Preload.js.map