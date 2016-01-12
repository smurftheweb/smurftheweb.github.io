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
        var returnArr = this.makeFilled3DArray(building.top, building.floors);
        returnArr[0][0] = building.bottom;
        returnArr.push([building.roof]);
        return returnArr;
    }

    generateMap(map, fill) {
        //generates a blank map based on dimensions
        var i = 0;
        var tiles = [];
        while (i < (map.units * map.units)) {
            tiles[i] = fill;
            i++;
        }
        return tiles;
    }

    generateRect(width, height, fill) {
        var r = 0;
        var rows = [];
        while (r < height) {
            rows[r] = this.makeFilled2DArray(fill, width);
            r++;
        }
        return rows;
    }

    generateSliceRect(width, height, slices, slice) {
        //generates a rectangle based on the slice provided (hardcoded atm)
        var masterRows = [];
        //var slices = this.game.tiles.slices[slice];
        //row index
        var r = 0;
        while (r < slices.length) {
            masterRows[r] = [];
            masterRows[r][0] = slices[r][0];
            var i = 1;
            while (i < (width - 1)) {
                masterRows[r][i] = slices[r][1];
                i++;
            }
            masterRows[r][i] = slices[r][2];
            r++;
        }
        //build out the final array
        var rectArr = [];
        rectArr[0] = masterRows[0];
        var r = 1;
        while (r < (height - 1)) {
            rectArr[r] = masterRows[1];
            r++;
        }
        rectArr[r] = masterRows[2];
        return rectArr;
    }

    // Makes a fill 2d array i.e. [0, 0, 0]
    makeFilled2DArray(fill, length) {
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = fill;
        }
    }

    /**
     * Creates a 3d array [[0], [0]] filled with the fill value
     * @param fill Value to fill with
     * @param length How long the array should be
     */
    makeFilled3DArray(fill, length) {
        //makes a filled 3d array: [[0], [0]]
        //currently only makes single length arrays
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = [fill];
        }
        return array;
    }

    mergePartial2D(map, tiles, partial, index) {
        //will overwrite all tiles
        //takes a map, and a partial map, and merges the partial into the map
        var i = 0;
        //partial should consist of an array of arrays, one array per row
        while (i < partial.length) {
            //remove items from the array
            tiles.splice(index + (map.units * i), partial[i].length);
            //remove items from the array
            tiles.splice.apply(tiles, [index + (map.units * i), 0].concat(partial[i]));
            i++;
        }
        return tiles;
    }

    mergePartial3D(map, tiles, partial, layer, index) {
        //will overwrite all tiles
        //takes a map, and a partial map, and merges the partial into the map
        //expects 3d arrays for tiles and partial
        var l = 0;
        while (l < partial.length) {
            tiles[(l + layer)] = this.mergePartial2D(map, tiles[(l + layer)], partial[l], index);
            l++;
        }
        return tiles;
    }

    mergePartial2DSafe(map, tiles, partial, index) {
        //will overwrite all tiles
        //takes a map, and a partial map, and merges the partial into the map
        var i = 0;
        //partial should consist of an array of arrays, one array per row
        while (i < partial.length) {
            var j = 0;
            while (j < partial[i].length) {
                if (partial[i][j] != 0) {
                    //there's some content here we want to merge
                    tiles[index + (map.units * i) + j] = partial[i][j];
                }
                j++;
            }
            i++;
        }
        return tiles;
    }

    mergePartial3DSafe(map, tiles, partial, layer, index) {
        //will overwrite all tiles
        //takes a map, and a partial map, and merges the partial into the map
        //expects 3d arrays for tiles and partial
        var l = 0;
        while (l < partial.length) {
            tiles[(l + layer)] = this.mergePartial2DSafe(map, tiles[(l + layer)], [partial[l]], index);
            l++;
        }
        return tiles;
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