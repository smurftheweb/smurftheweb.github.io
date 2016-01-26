class Preload extends Phaser.State {

    asset: Phaser.Sprite;
    ready: boolean = false;

    preload(): void {
        console.log("preload init");
        this.asset = this.add.sprite(this.stage.width / 2, this.stage.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);
        this.load.atlasXML('landscape', 'assets/landscapeTiles_sheet.png', 'assets/landscapeTiles_sheet.xml');
        this.load.atlasXML('building', 'assets/buildingTiles_sheet.png', 'assets/buildingTiles_sheet.xml');
        this.load.atlasXML('city', 'assets/cityTiles_sheet.png', 'assets/cityTiles_sheet.xml');
    }

    create(): void {
        //this.asset.cropEnabled = false; NOT FOUND
    }

    update(): void {
        if (!!this.ready) {
            this.game.state.start('boot');
        }
    }

    onLoadComplete(): void {
        this.ready = true;
    }
}