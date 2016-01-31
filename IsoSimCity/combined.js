var Chunk = (function () {
    function Chunk() {
    }
    return Chunk;
})();
/// <reference path="../../libs/phaser/phaser.d.ts" />
/// <reference path="../../libs/phaser/p2.d.ts" />
/// <reference path="../../libs/phaser/pixi.d.ts" />
/// <reference path="../../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
var IsoExample = (function () {
    function IsoExample() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    IsoExample.prototype.preload = function () {
        // setup phaser
        this.game.time.advancedTiming = true;
        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);
        this.iso.projector.anchor.setTo(0.5, 0.2);
        this.game.load.image('tile', '../../assets/tile.png');
    };
    IsoExample.prototype.create = function () {
        this.isoGroup = this.game.add.group();
        // spawn the tiles
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // create a tile using the new isoSprite factory method
                tile = this.iso.addIsoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
                tile.anchor.setTo(0.5, 0);
            }
        }
        // provide a 3d position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
    };
    IsoExample.prototype.update = function () {
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
    IsoExample.prototype.render = function () {
        this.game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
        this.game.debug.text(String(this.game.time.fps) || '---', 2, 14, "#a7aebe");
    };
    return IsoExample;
})();
window.onload = function () {
    var game = new IsoExample();
};
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
/// <reference path="../libs/phaser/phaser.d.ts" />
/// <reference path="../libs/phaser/p2.d.ts" />
/// <reference path="../libs/phaser/pixi.d.ts" />
/// <reference path="../libs/phaser-isometric/phaser-plugin-isometric.d.ts" />
/// <reference path="../src/states/Preload.ts" />
var IsoGame = (function () {
    function IsoGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    IsoGame.prototype.preload = function () {
        // setup advanced settings
        this.game.time.advancedTiming = true;
        this.game.debug.renderShadow = false;
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.smoothed = false;
        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.iso.projector.anchor.setTo(0.5, 0.1);
        //this.game.iso.anchor.setTo(0.5, 0.1);
        this.game.renderer.renderSession.roundPixels = true;
        // Game States
        this.game.state.add('boot', 'Boot');
        this.game.state.add('gameover', 'GameOver');
        this.game.state.add('menu', 'Menu');
        this.game.state.add('play', 'Play');
        this.game.state.add('preload', new Preload());
    };
    IsoGame.prototype.create = function () {
        this.game.state.start('preload');
    };
    return IsoGame;
})();
window.onload = function () {
    var game = new IsoGame();
};
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
                    var i = 0;
                    var cType;
                    var index;
                    while (i < tiles[l].length) {
                        // randomly place features
                        if (tiles[l - 1][i] == 66 && this.getRandomNumber(1, PARK_DENSITY) == 1) {
                            // this will be a park
                            tiles[l - 1][i] = this.tiles.parks[this.getRandomNumber(0, this.tiles.parks.length - 1)];
                        }
                        else {
                            // we aren't drawing a park
                            if (this.getRandomNumber(1, WALL_DENSITY) == 1) {
                                // we are drawing a wall
                                cType = "wall";
                            }
                            else {
                                cType = "building";
                            }
                            if (tiles[l - 1][i] != 66) {
                                // find eligible directions
                                var eligibleDirs = [];
                                if (ewTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i][i - map.units] == 66) {
                                    eligibleDirs.push("s");
                                }
                                if (nsTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i + 1] == 66) {
                                    eligibleDirs.push("w");
                                }
                                if (ewTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i + map.units] == 66) {
                                    eligibleDirs.push("n");
                                }
                                if (nsTiles.indexOf(tiles[l - 1][i]) != -1 && tiles[l - 1][i - 1] == 66) {
                                    eligibleDirs.push("e");
                                }
                                // check to see what to do (draw the building)
                                if (eligibleDirs.indexOf("s") != -1) {
                                    // match the north side of the road
                                    index = i - map.units;
                                    if (tiles[l][index] == 0) {
                                        if (cType == "building") {
                                            var coords = this.getCoordsFromIndex(map, index);
                                            box = this.generateBuilding("s", coords, heart); // TODO!?
                                            tiles = this.mergePartial3DSafe(map, tiles, box, l, index);
                                        }
                                        else if (cType == "wall") {
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
                                        }
                                        else if (cType == "wall") {
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
                                        }
                                        else if (cType == "wall") {
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
                                        }
                                        else if (cType == "wall") {
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
    // buildings start here
    Generate.prototype.generateBuilding = function (direction, coords, heart) {
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
        }
        else {
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
            }
            else {
                // if we didn't find a suitable colour, shuffle the colours
                colour = colours[this.getRandomNumber(0, colours.length - 1)];
            }
        }
        // directional top
        if (direction == "n" || direction == "s") {
            building.top = this.tiles.buildings[type][colour].tops["ns"][this.getRandomNumber(0, this.tiles.buildings[type][colour].tops["ns"].length - 1)];
        }
        else {
            building.top = this.tiles.buildings[type][colour].tops["ew"][this.getRandomNumber(0, this.tiles.buildings[type][colour].tops["ew"].length - 1)];
        }
        // pick a roof
        if (this.getRandomNumber(0, 1) == 1 && this.tiles.buildings[type]["all"].roofs["all"].length != 0) {
            // this is going to be an "all" direction roof
            building.roof = this.tiles.buildings[type]["all"].roofs["all"][this.getRandomNumber(0, this.tiles.buildings[type]["all"].roofs["all"].length - 1)];
        }
        else {
            // directional top
            building.roof = this.tiles.buildings[type]["all"].roofs[direction][this.getRandomNumber(0, this.tiles.buildings[type]["all"].roofs[direction].length - 1)];
        }
        return this.makeBuilding(building);
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
var Heart = (function () {
    function Heart(z_min, z_max, radius) {
        this.z_min = z_min;
        this.z_max = z_max;
        this.radius = radius;
    }
    return Heart;
})();
var Boot = (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        _super.apply(this, arguments);
    }
    Boot.prototype.preload = function () {
    };
    Boot.prototype.create = function () { };
    Boot.prototype.update = function () { };
    Boot.prototype.render = function () { };
    return Boot;
})(Phaser.State);
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
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        _super.apply(this, arguments);
    }
    Menu.prototype.create = function () {
        var style = { font: '65px Arial', fill: '#ffffff', align: 'center' };
        this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
        this.titleText.anchor.setTo(0.5, 0.5);
        this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center' });
        this.instructionsText.anchor.setTo(0.5, 0.5);
        this.sprite.angle = -20;
        this.game.add.tween(this.sprite).to({ angle: 20 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    };
    Menu.prototype.update = function () {
        if (this.game.input.activePointer.justPressed()) {
            this.game.state.start('play');
        }
    };
    return Menu;
})(Phaser.State);
var Play = (function (_super) {
    __extends(Play, _super);
    function Play() {
        _super.apply(this, arguments);
    }
    Play.prototype.preload = function () {
    };
    Play.prototype.create = function () { };
    Play.prototype.update = function () { };
    Play.prototype.render = function () { };
    return Play;
})(Phaser.State);
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
        var c = 0;
        while (c < this.chunks.length) {
            this.cleanChunk(c);
            c++;
        }
    };
    WorldManager.prototype.cleanChunk = function (c) {
        var i = 0;
        var arrLen = this.chunks[c].tiles[0].length;
        while (i < arrLen) {
            if (this.chunks[c].tiles[2][i] != 0) {
                // the top most layer has tiles, everything under it is dead
                this.chunks[c].tiles[0][i] = 0;
                this.chunks[c].tiles[1][i] = 0;
            }
            else if (this.chunks[c].tiles[1][i] != 0) {
                this.chunks[c].tiles[0][i] = 0;
            }
            i++;
        }
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
//# sourceMappingURL=combined.js.map