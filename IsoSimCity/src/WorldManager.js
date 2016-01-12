/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
var WorldManager = (function () {
    function WorldManager(game, iso) {
        this.world = {
            layers: 10,
            units: 20,
            chunks: 4,
            tile_size: 70,
            tile_size_z: 32
        };
        this.layers = [];
        this.chunks = [];
        this.game = game;
        this.iso = iso;
    }
    WorldManager.prototype.buildLayers = function (layers) {
        var l = 0;
        while (l < layers) {
            var layer = {};
            switch (l) {
                case 0:
                    layer.tileset = "landscape";
                    layer.z = 0;
                    break;
                case 1:
                    layer.tileset = "city";
                    layer.z = 0;
                    break;
                case 2:
                    layer.tileset = "buildings";
                    layer.z = 0;
                    break;
                default:
                    layer.tileset = "buildings";
                    layer.z = (this.world.tile_size_z * (l - 1)) + 10;
                    break;
            }
            this.layers.push(layer);
            l++;
        }
    };
    WorldManager.prototype.createWorld = function (tiles) {
        // add a layer at a specific index with name and z level
        this.buildLayers(this.world.layers);
        var c = 0;
        var chunk;
        while (c < Math.pow(this.world.chunks, 2)) {
            chunk = this.createChunk(c, tiles);
            this.chunks.push(chunk);
            c++;
        }
    };
    WorldManager.prototype.createChunk = function (c, tiles) {
        var chunk = new Chunk();
        chunk.x = (this.world.units * this.world.tile_size) * (c % this.world.chunks);
        chunk.y = (this.world.units * this.world.tile_size) * Math.floor(c / this.world.chunks);
        // setup cardinal directions for bounds checking
        chunk.left = chunk.x;
        chunk.right = chunk.left + (this.world.units * this.world.tile_size);
        chunk.top = chunk.y;
        chunk.bottom = chunk.top + (this.world.units * this.world.tile_size);
        return {
            group: this.game.add.group(),
            chunk: chunk,
            tiles: this.createTiles(tiles)
        };
    };
    WorldManager.prototype.createTiles = function (tiles) {
        var i = 0;
        var returnTiles = [];
        while (i < this.layers.length) {
            returnTiles.push(tiles);
            i++;
        }
        return returnTiles;
    };
    WorldManager.prototype.getAllTiles = function (chunk) {
        var i = 0;
        var tiles = [];
        while (i < this.chunks[chunk].tiles.length) {
            tiles[i] = this.chunks[chunk].tiles[i];
            i++;
        }
        return JSON.parse(JSON.stringify(tiles));
    };
    WorldManager.prototype.setAllTiles = function (chunk, tiles) {
        // pass it a full layers array, and it makes it happen
        var l = 0;
        while (l < this.chunks[chunk].tiles.length) {
            this.chunks[chunk].tiles[l] = tiles[l];
            l++;
        }
    };
    WorldManager.prototype.cleanWorld = function () {
    };
    WorldManager.prototype.clearChunk = function (e) {
    };
    WorldManager.prototype.drawWorld = function () {
        var c = 0;
        var sprites = 0;
        while (c < this.chunks.length) {
            sprites += this.drawChunk(c);
            c++;
        }
    };
    WorldManager.prototype.drawChunk = function (c) {
        // tiles in the layer
        var totalSprites = 0;
        var i;
        // layers in the map
        var l = 0;
        var tile;
        // draw each layer, starting at 0
        while (l < this.chunks[c].tiles.length) {
            // draw each tile in layer
            i = 0;
            while (i < this.chunks[c].tiles[l].length) {
                var x = ((i % this.world.units) * this.world.tile_size) + this.chunks[c].chunk.x;
                var y = (Math.floor(i / this.world.units) * this.world.tile_size) + this.chunks[c].chunk.y;
                var z = this.layers[l].z;
                // add the tile
                if (this.chunks[c].tiles[l][i] != 0) {
                    tile = this.iso.addIsoSprite(x, y, z, this.layers[l].tileset, this.chunks[c].tiles[l][i], this.chunks[c].group);
                    //tile = this.game.add.isoSprite(x, y, z, this.layers[l].tileset, this.chunks[c].tiles[l][i], this.chunks[c].group);
                    tile.anchor.setTo(0.5, 1);
                    tile.smoothed = false;
                    tile.scale.x = 1;
                    tile.scale.y = 1;
                    // TODO: refactor me, I can probably do this better
                    if (l == 0 || l == 1 || l == 2) {
                        if (i == 0) {
                            // set top of the chunk
                            this.chunks[c].top = tile.y - (this.world.tile_size * 1.5);
                        }
                        else if (i == (this.world.units - 1)) {
                            // set right of chunk
                            this.chunks[c].right = tile.x + this.world.tile_size;
                        }
                        else if (i == (this.world.units * (this.world.units - 1))) {
                            // set left of chunk
                            this.chunks[c].left = tile.x - this.world.tile_size;
                        }
                        else if (i == (this.world.units * this.world.units) - 1) {
                            // set bottom of chunk
                            this.chunks[c].bottom = tile.y;
                        }
                    }
                    totalSprites++;
                }
                i++;
            }
            l++;
            this.iso.projector.simpleSort(this.chunks[c].group);
        }
        return totalSprites;
    };
    return WorldManager;
})();
//# sourceMappingURL=WorldManager.js.map