var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        _super.apply(this, arguments);
    }
    GameOver.prototype.create = function () {
        var style = { font: '65px Arial', fill: '#ffffff', align: 'center' };
        this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Game Over!', style);
        this.titleText.anchor.setTo(0.5, 0.5);
        this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center' });
        this.congratsText.anchor.setTo(0.5, 0.5);
        this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center' });
        this.instructionText.anchor.setTo(0.5, 0.5);
    };
    GameOver.prototype.update = function () {
        if (this.game.input.activePointer.justPressed()) {
            this.game.state.start('play');
        }
    };
    GameOver.prototype.render = function () { };
    return GameOver;
})(Phaser.State);
//# sourceMappingURL=GameOver.js.map