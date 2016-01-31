/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />

class Generate {

    isogame: IsoGame;
    game: Phaser.Game;
    iso: Phaser.Plugin.Isometric;
    roads: any;
    tiles: any;

    HIGHWAY_WIDTH: number;
    HIGHWAY_EASEMENT: number = 2;


    constructor(isogame: IsoGame) {
        this.isogame = isogame;
        this.game = isogame.game;
        this.iso = isogame.iso;
        this.roads = isogame.roads;
        this.tiles = isogame.tiles;
    }

    generateChunk(map, tiles) {
        // this generates a chunk (20x20 block) according to rules we've defined
        // this is whereit happens.
        var HIGHWAY_WIDTH = this.tiles.highways.straight["n"].length + this.tiles.highways.edges["n"].length;
        // how many land is undeveloped between highway and block
        var HIGHWAY_EASEMENT = 2;
        var HIGHWAY_SINGLE_WIDTH = (HIGHWAY_WIDTH + HIGHWAY_EASEMENT) / 2;
        // only half of the highway width is used on each side, that equals a full one
        var CITY_CHUNK_SPACE = map.units - (HIGHWAY_WIDTH + HIGHWAY_EASEMENT);
        var CITY_START = (map.units * HIGHWAY_SINGLE_WIDTH) + HIGHWAY_SINGLE_WIDTH;
        
        // road consts
        var ROAD_START_OFFSET = 4;
        var MIN_ROAD_SPLIT = 3;
        var MAX_ROAD_SPLIT = 4;

        // building consts
        // density, 1 out of X building tiles will be a Y
        var PARK_DENSITY = 12;
        var WALL_DENSITY = 12;

        // this will get it's own section I think (I presume this is the heart of the chunk)
        var heart = new Heart(2, 6, 2);

        // calculate some values
        heart.x = this.getRandomNumber((HIGHWAY_SINGLE_WIDTH + heart.radius), (map.units - HIGHWAY_SINGLE_WIDTH) - heart.radius);
        heart.y = this.getRandomNumber((HIGHWAY_SINGLE_WIDTH + heart.radius), (map.units - HIGHWAY_SINGLE_WIDTH) - heart.radius);
        heart.x_min = heart.x - heart.radius;
        heart.x_max = heart.x + heart.radius;
        heart.y_min = heart.y - heart.radius;
        heart.y_max = heart.y + heart.radius;

        // start looping for the layers
        var l = 0;
        var rect, box;
        // this is hardcoded for now, this may change (or not), buildings start on layer 2
        while (l < 4) {
            switch (l) {
                case 0:
                    // grass on dirt
                    rect = this.generateRect(map.units, map.units, 67);
                    tiles[l] = this.mergePartial2D(map, tiles[l], rect, 0);
                    break;
                case 1:
                    // this spawns paved areas
                    // 14 because the highway takes up 3 on each edge, this will probably change
                    rect = this.generateRect(CITY_CHUNK_SPACE, CITY_CHUNK_SPACE, 66);
                    // starting on 63, because that's 4,4 after highway edges
                    tiles[l] = this.mergePartial2DSafe(map, tiles[l], rect, CITY_START);
                    
                    // drawing the highways
                    tiles[l] = this.generateHighway(map, tiles[l], 0, "s", ["e"], map.units);
                    tiles[l] = this.generateHighway(map, tiles[l], (map.units - (HIGHWAY_WIDTH / 2)), "s", ["w"], map.units);
                    tiles[l] = this.generateHighway(map, tiles[l], 0, "e", ["s"], map.units);
                    tiles[l] = this.generateHighway(map, tiles[l], ((map.units * map.units) - (map.units * (HIGHWAY_WIDTH / 2))), "e", ["n"], map.units);

                    // fix the highways
                    tiles[l] = this.roads.fixHighways(map, tiles[l], "nw");
                    tiles[l] = this.roads.fixHighways(map, tiles[l], "ne");
                    tiles[l] = this.roads.fixHighways(map, tiles[l], "se");
                    tiles[l] = this.roads.fixHighways(map, tiles[l], "sw");

                    // start to spawn the roads
                    var x = this.getRandomNumber((ROAD_START_OFFSET + 1), (ROAD_START_OFFSET + 2));
                    while (x < (map.units - ROAD_START_OFFSET)) {
                        var index = this.getIndexFromCoords(map, x, HIGHWAY_EASEMENT);
                        tiles[l] = this.generateRoad(map, tiles[l], "city_plain", index, "s", map.units - HIGHWAY_EASEMENT);

                        // cap the highways
                        tiles[l] = this.roads.joinRoadHighway(map, tiles[l], x, HIGHWAY_EASEMENT, "n");
                        tiles[l] = this.roads.joinRoadHighway(map, tiles[l], x, map.units - 1, "s");
                        x += this.getRandomNumber(MIN_ROAD_SPLIT, MAX_ROAD_SPLIT);
                    }

                    var y = this.getRandomNumber((ROAD_START_OFFSET + 1), (ROAD_START_OFFSET + 2));
                    while (y < (map.units - ROAD_START_OFFSET)) {
                        var index = this.getIndexFromCoords(map, HIGHWAY_EASEMENT, y);
                        tiles[l] = this.generateRoad(map, tiles[l], "city_plain", index, "e", map.units - HIGHWAY_EASEMENT);

                        // cap the highways
                        tiles[l] = this.roads.joinRoadHighway(map, tiles[l], HIGHWAY_EASEMENT, y, "w");
                        tiles[l] = this.roads.joinRoadHighway(map, tiles[l], map.units - 1, y, "e");
                        y += this.getRandomNumber(MIN_ROAD_SPLIT, MAX_ROAD_SPLIT);
                    }
                    // road magic!
                    tiles[l] = this.roads.fixRoads(map, tiles[l], "city_plain");
                    break;
                case 2:
                    // start to generate buildings
                    var ewTiles = this.roads.getIndices(["e", "w"]);
                    var nsTiles = this.roads.getIndices(["n", "s"]);
                    var i: number = 0;
                    var cType: string;
                    var index: number;
                    while (i < tiles[l].length) {
                        // randomly place features
                        if (tiles[l - 1][i] == 66 && this.getRandomNumber(1, PARK_DENSITY) == 1) {
                            // this will be a park
                            tiles[l - 1][i] = this.tiles.parks[this.getRandomNumber(0, this.tiles.parks.length - 1)];
                        } else {
                            // we aren't drawing a park
                            if (this.getRandomNumber(1, WALL_DENSITY) == 1) {
                                // we are drawing a wall
                                cType = "wall";
                            } else {
                                cType = "building";
                            }
                            if (tiles[l - 1][i] != 66) {
                                // find eligible directions
                                var eligibleDirs = [];
                                if (ewTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i][i - map.units] == 66) { eligibleDirs.push("s"); }
                                if (nsTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i + 1] == 66) { eligibleDirs.push("w"); }
                                if (ewTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i + map.units] == 66) { eligibleDirs.push("n"); }
                                if (nsTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i - 1] == 66) { eligibleDirs.push("e"); }

                                // check to see what to do (draw the building)
                                if (eligibleDirs.indexOf("s") != -1) {
                                    // match the north side of the road
                                    index = i - map.units;
                                    if (tiles[l][index] == 0) {
                                        if (cType == "building") {
                                            var coords = this.getCoordsFromIndex(map, index);
                                            box = this.generateBuilding("s", coords, heart); // TODO!?
                                            tiles = this.mergePartial3DSafe(map, tiles, box, l, index);
                                        } else if (cType == "wall") {
                                            tiles[l - 1][index] = this.tiles.walls.s[this.getRandomNumber(0, (this.tiles.walls.s.length - 1))];
                                        }
                                    }
                                } // end if eligibleDirs "s"
                                if (eligibleDirs.indexOf("e") != -1) {
                                    // match the west side of the road
                                    index = i - 1;
                                    if (tiles[l][index] == 0) {
                                        if (cType == "building") {
                                            var coords = this.getCoordsFromIndex(map, index);
                                            box = this.generateBuilding("e", coords, heart);
                                            tiles = this.mergePartial3DSafe(map, tiles, box, l, index);
                                        } else if (cType == "wall") {
                                            tiles[l - 1][index] = this.tiles.walls.e[this.getRandomNumber(0, (this.tiles.walls.e.length - 1))];
                                        }
                                    }
                                } // end if eligibleDirs "e"
                                if (eligibleDirs.indexOf("w") != -1) {
                                    // match the east side of the road
                                    index = i + 1;
                                    if (tiles[l][index] == 0) {
                                        if (cType == "building") {
                                            var coords = this.getCoordsFromIndex(map, index);
                                            box = this.generateBuilding("w", coords, heart);
                                            tiles = this.mergePartial3DSafe(map, tiles, box, l, index);
                                        } else if (cType == "wall") {
                                            tiles[l - 1][index] = this.tiles.walls.w[this.getRandomNumber(0, (this.tiles.walls.w.length - 1))];
                                        }
                                    }
                                } // end if eligibleDirs "w"
                                if (eligibleDirs.indexOf("n") != -1) {
                                    // match the south side of the road
                                    index = i + map.units;
                                    if (tiles[l][index] == 0) {
                                        if (cType == "building") {
                                            var coords = this.getCoordsFromIndex(map, index);
                                            box = this.generateBuilding("n", coords, heart);
                                            tiles = this.mergePartial3DSafe(map, tiles, box, l, index);
                                        } else if (cType == "wall") {
                                            tiles[l - 1][index] = this.tiles.walls.n[this.getRandomNumber(0, (this.tiles.walls.n.length - 1))];
                                        }
                                    }
                                } // end if eligibleDirs "n"
                            }
                        }
                    }
                    i++;
                }
            l++;
            }
            
        return tiles;
    }

    generateHighway(map, tiles, start, direction, half, length) {
        //generates highways from lines (2d, pass in only one array)
        //lines should be expressed: {start: 1, direction: s, length: 5}
        var highway = this.tiles.highways.straight[direction];
        var edge = this.tiles.highways.edges[direction]
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
            } else if (direction == "n" || direction == "s") {
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
    }

    generateRoad(map, tiles, set, start, direction, length) {
        //generates roads from lines (2d, pass in only one array)
        //lines should be expressed: {start: 1, direction: s, length: 5}
        if (direction == "n" || direction == "s") {
            var road = this.roads.getIndex("ns".split(""), "city_plain");
        } else {
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
    }

    // buildings start here
    generateBuilding(direction, coords, heart) {
        // test stuff with auto types and height
        var type;
        var low = heart.z_min;
        var high = heart.z_max;
        if (coords.x >= heart.x_min && coords.x <= heart.x_max && coords.y >= heart.y_min && coords.y <= heart.y_max) {
            // this is going to be a commercial building
            type = "commercial";
            // figure out the distance to the heart (int = intensity)
            var int_p = 1 / (heart.radius + 1);
            var int_m_x = Math.abs(coords.x - heart.x);
            var int_m_y = Math.abs(coords.y - heart.y);
            var int_m = (int_m_x + int_m_y) / 2;
            var int_t = 1 - (int_m * int_p);
            var z_mod = ((high - low) * int_t);

            high = Math.floor(z_mod + low);
            low = (((high - 1) < low) ? low : (high - 1));
        } else {
            // this is a residential building
            type = "residential";
            low = 1;
            high = 2;
        }
        // end test

        var colours = ["red", "grey", "brown", "beige"];
        var colour = colour[this.getRandomNumber(0, colours.length - 1)];
        var building = null;

        // while we don't find a suitable colour...
        while (building === null) {
            // try to find a suitable colour
            if (this.tiles.buildings[type][colour].bottoms[direction].length != 0) {
                building = {
                    bottom: this.tiles.buildings[type][colour].bottoms[direction][this.getRandomNumber(0, this.tiles.buildings[type][colour].bottoms[direction].length - 1)],
                    floors: this.getRandomNumber(low, high)
                };
            } else {
                // if we didn't find a suitable colour, shuffle the colours
                colour = colours[this.getRandomNumber(0, colours.length - 1)];
            }
        }

        // directional top
        if (direction == "n" || direction == "s") {
            building.top = this.tiles.buildings[type][colour].tops["ns"][this.getRandomNumber(0, this.tiles.buildings[type][colour].tops["ns"].length - 1)];
        } else {
            building.top = this.tiles.buildings[type][colour].tops["ew"][this.getRandomNumber(0, this.tiles.buildings[type][colour].tops["ew"].length - 1)];
        }

        // pick a roof
        if (this.getRandomNumber(0, 1) == 1 && this.tiles.buildings[type]["all"].roofs["all"].length != 0) {
            // this is going to be an "all" direction roof
            building.roof = this.tiles.buildings[type]["all"].roofs["all"][this.getRandomNumber(0, this.tiles.buildings[type]["all"].roofs["all"].length - 1)];
        } else {
            // directional top
            building.roof = this.tiles.buildings[type]["all"].roofs[direction][this.getRandomNumber(0, this.tiles.buildings[type]["all"].roofs[direction].length - 1)];
        }

        return this.makeBuilding(building);

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