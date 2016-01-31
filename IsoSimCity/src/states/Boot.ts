class Boot extends Phaser.State {

    game: Phaser.Game;
    worldManager: WorldManager;
    generate: Generate;
    cursors;
    wPx;
    hPx;
    velocity: number = 5;

    preload() {
        // generate the world
        this.wPx = this.worldManager.world.chunks * (this.worldManager.world.units * 132);
        this.hPx = this.worldManager.world.chunks * (this.worldManager.world.units * 74);
        this.world.setBounds(0, 0, this.wPx, this.hPx);

        // generate all layers
        this.worldManager.createWorld(this.generate.generateMap(this.worldManager.world, 0));

        // build the chunk!
        var c = 0;
        while (c < this.worldManager.chunks.length) {
            var tiles = this.worldManager.getAllTiles(c);
            tiles = this.generate.generateChunk(this.worldManager.world, tiles);
            this.worldManager.setAllTiles(c, tiles);
            this.worldManager.cleanWorld();
            c++;
        }
    }

    create() {
        this.worldManager.drawWorld();
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.world.camera.roundPx = false;
        this.moveCamera((this.wPx / 2) - (1024 / 2), (this.hPx / 2) - (768 / 2));
    }

    update() {
        // this is how scaling is done, but the code is super rough
        // isoGroup.scale.setTo(2, 2);
        if (this.cursors.right.isDown) {
            this.moveCamera((this.world.camera.x + this.velocity), this.world.camera.y);
        } else if (this.cursors.left.isDown) {
            this.moveCamera((this.world.camera.x - this.velocity), this.world.camera.y);
        }

        if (this.cursors.down.isDown) {
            this.moveCamera(this.world.camera.x, (this.world.camera.y + this.velocity));
        } else if (this.cursors.up.isDown) {
            this.moveCamera(this.world.camera.x, (this.world.camera.y - this.velocity));
        }
    }

    render() { }

    moveCamera(x: number, y: number) {
        // first set camera
        this.world.camera.setPosition(x, y);
        // get the real world view coords of the camera
        var isoCam = this.world.camera.view;
        // make a rectangle out of them
        // TODO: Change resolution to consts
        var viewport = {
            left: isoCam.x,
            right: isoCam.x + 1024,
            top: isoCam.y,
            bottom: isoCam.y + 768
        };

        // go through each chunk, and check if it is in frame or not (i.e. do we need to draw it?)
        var i = 0;
        while (i < this.worldManager.chunks.length) {
            if (this.intersectRect(this.worldManager.chunks[i], viewport) === true) {
                // do something
                this.worldManager.chunks[i].group.visible = true;
            } else {
                this.worldManager.chunks[i].group.visible = false;
            }
            i++;
        }
    }

    intersectRect(r1, r2) {
        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    }
}