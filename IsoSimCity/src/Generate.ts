/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />

class Generate {

    game: Phaser.Game;
    iso: Phaser.Plugin.Isometric;

    HIGHWAY_WIDTH: number;
    HIGHWAY_EASEMENT: number = 2;


    constructor(game: Phaser.Game, iso: Phaser.Plugin.Isometric) {
        this.game = game;
        this.iso = iso;
    }

    generateChunk(map, tiles) {
    }

    generateHighway(map, tiles, start, direction, half, length) {
    }

    generateRoad(map, tiles, set, start, direction, length) {

    }

    generateBuilding(direction, coords, heart) {

    }

    makeBuilding(building) {

    }

    generateMap(map, fill) {

    }

    generateRect(width, height, fill) {

    }

    generateSliceRect(width, height, slice) {

    }

    // Makes a fill 2d array i.e. [0, 0, 0]
    makeFilled2DArray(fill, length) {
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = fill;
        }
    }

    makeFilled3DArray(fill, length) {

    }

    mergePartial2D(map, tiles, partial, index) {

    }

    mergePartial3D(map, tiles, partial, layer, index) {

    }

    mergePartial2DSafe(map, tiles, partial, index) {

    }

    mergePartial3DSafe(map, tiles, partial, layer, index) {

    }

    // give the index of the tile wanted, and get the x,y coords
    // 1, 1 is top left corner
    getCoordsFromIndex(map, index): any {
        var y = Math.floor(index / map.units);
        var x = index - (y * map.units);
        return {
            x: x + 1,
            y: y + 1
        };
    }

    // given an x / y coordinate, return the index of the tile in the array
    // 1, 1 is top left corner
    getIndexFromCoords(map, x, y): number {
        var xOffset = x - 1;
        var yOffset = (y - 1) * map.units;
        return xOffset + yOffset;
    }

    getRandomNumber(min, max): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}