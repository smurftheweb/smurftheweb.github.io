/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
var Generate = (function () {
    function Generate(isogame) {
        this.HIGHWAY_EASEMENT = 2;
        this.isogame = isogame;
        this.game = isogame.game;
        this.iso = isogame.iso;
        this.roads = isogame.roads;
        this.tiles = isogame.tiles;
    }
    Generate.prototype.generateChunk = function (map, tiles) {
    };
    Generate.prototype.generateHighway = function (map, tiles, start, direction, half, length) {
        //generates highways from lines (2d, pass in only one array)
        //lines should be expressed: {start: 1, direction: s, length: 5}
        var highway = this.tiles.highways.straight[direction];
        var edge = this.tiles.highways.edges[direction];
        var fullSlice = [edge[b], highway[0], highway[1], edge[b]];
        var i = 0;
        //for border toggle
        var b = 0;
        while (i < length) {
            //flip flop b
            //b = ((b == 0) ? 1 : 0);
            fullSlice = [edge[b], highway[0], highway[1], edge[b]];
            //the the direction matching logic stuff
            if (direction == "e" || direction == "w") {
                //everything is same except the offset
                var index = ((direction == "e") ? (start + i) : (start - 1));
                var c = 0;
                if (half.indexOf("n") != -1) {
                    tiles[index + (map.units * c++)] = fullSlice[0];
                    tiles[index + (map.units * c++)] = fullSlice[1];
                }
                if (half.indexOf("s") != -1) {
                    tiles[index + (map.units * c++)] = fullSlice[2];
                    tiles[index + (map.units * c++)] = fullSlice[3];
                }
            }
            else if (direction == "n" || direction == "s") {
                //everything is same except the offset
                var index = ((direction == "s") ? (start + (map.units * i)) : (start - (map.units * i)));
                var c = 0;
                if (half.indexOf("w") != -1) {
                    tiles[index + (c++)] = fullSlice[0];
                    tiles[index + (c++)] = fullSlice[1];
                }
                if (half.indexOf("e") != -1) {
                    tiles[index + (c++)] = fullSlice[2];
                    tiles[index + (c++)] = fullSlice[3];
                }
            }
            i++;
        }
        return tiles;
    };
    Generate.prototype.generateRoad = function (map, tiles, set, start, direction, length) {
        //generates roads from lines (2d, pass in only one array)
        //lines should be expressed: {start: 1, direction: s, length: 5}
        if (direction == "n" || direction == "s") {
            var road = this.roads.getIndex("ns".split(""), "city_plain");
        }
        else {
            var road = this.roads.getIndex("ew".split(""), "city_plain");
        }
        tiles[start] = road;
        var i = 1;
        while (i < length) {
            switch (direction) {
                case "n":
                    tiles[start - (map.units * i)] = road;
                    break;
                case "e":
                    tiles[start + i] = road;
                    break;
                case "w":
                    tiles[start - i] = road;
                    break;
                case "s":
                    tiles[start + (map.units * i)] = road;
                    break;
            }
            i++;
        }
        return tiles;
    };
    Generate.prototype.generateBuilding = function (direction, coords, heart) {
    };
    Generate.prototype.makeBuilding = function (building) {
        var returnArr = this.makeFilled3DArray(building.top, building.floors);
        returnArr[0][0] = building.bottom;
        returnArr.push([building.roof]);
        return returnArr;
    };
    Generate.prototype.generateMap = function (map, fill) {
        //generates a blank map based on dimensions
        var i = 0;
        var tiles = [];
        while (i < (map.units * map.units)) {
            tiles[i] = fill;
            i++;
        }
        return tiles;
    };
    Generate.prototype.generateRect = function (width, height, fill) {
        var r = 0;
        var rows = [];
        while (r < height) {
            rows[r] = this.makeFilled2DArray(fill, width);
            r++;
        }
        return rows;
    };
    Generate.prototype.generateSliceRect = function (width, height, slices, slice) {
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
    };
    // Makes a fill 2d array i.e. [0, 0, 0]
    Generate.prototype.makeFilled2DArray = function (fill, length) {
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = fill;
        }
    };
    /**
     * Creates a 3d array [[0], [0]] filled with the fill value
     * @param fill Value to fill with
     * @param length How long the array should be
     */
    Generate.prototype.makeFilled3DArray = function (fill, length) {
        //makes a filled 3d array: [[0], [0]]
        //currently only makes single length arrays
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = [fill];
        }
        return array;
    };
    Generate.prototype.mergePartial2D = function (map, tiles, partial, index) {
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
    };
    Generate.prototype.mergePartial3D = function (map, tiles, partial, layer, index) {
        //will overwrite all tiles
        //takes a map, and a partial map, and merges the partial into the map
        //expects 3d arrays for tiles and partial
        var l = 0;
        while (l < partial.length) {
            tiles[(l + layer)] = this.mergePartial2D(map, tiles[(l + layer)], partial[l], index);
            l++;
        }
        return tiles;
    };
    Generate.prototype.mergePartial2DSafe = function (map, tiles, partial, index) {
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
    };
    Generate.prototype.mergePartial3DSafe = function (map, tiles, partial, layer, index) {
        //will overwrite all tiles
        //takes a map, and a partial map, and merges the partial into the map
        //expects 3d arrays for tiles and partial
        var l = 0;
        while (l < partial.length) {
            tiles[(l + layer)] = this.mergePartial2DSafe(map, tiles[(l + layer)], [partial[l]], index);
            l++;
        }
        return tiles;
    };
    // give the index of the tile wanted, and get the x,y coords
    // 1, 1 is top left corner
    Generate.prototype.getCoordsFromIndex = function (map, index) {
        var y = Math.floor(index / map.units);
        var x = index - (y * map.units);
        return {
            x: x + 1,
            y: y + 1
        };
    };
    // given an x / y coordinate, return the index of the tile in the array
    // 1, 1 is top left corner
    Generate.prototype.getIndexFromCoords = function (map, x, y) {
        var xOffset = x - 1;
        var yOffset = (y - 1) * map.units;
        return xOffset + yOffset;
    };
    Generate.prototype.getRandomNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return Generate;
})();
//# sourceMappingURL=Generate.js.map