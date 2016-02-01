class Road {

    game: Phaser.Game;
    tiles;
    generate: Generate;

    constructor(game: Phaser.Game, tiles: any, generate: Generate) {
        this.game = game;
        this.tiles = tiles;
        this.generate = generate;
    }

    fixRoads(map, tiles, set) {
        // give it all your tiles, and it makes your roads perfect!
        // road magic!
        var problemTiles = [];
        var nsProbs = this.findNSProblems(map, tiles);
        var ewProbs = this.findEWProblems(map, tiles);
        problemTiles = this.arrayUnique(nsProbs.concat(ewProbs));

        tiles = this.fixProblemTiles(map, tiles, set, problemTiles);
        return tiles;
    }

    // Give it the tiles, the corner this join happens in, and it puts some corners on your highway
    fixHighways(map, tiles, corner) {
        switch (corner) {
            case "nw":
                var cornerX = 2;
                var cornerY = 2;
                // fix the corner roads
                tiles[this.generate.getIndexFromCoords(map, cornerX - 1, cornerY - 1)] = this.tiles.highways.open;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY - 1)] = this.tiles.highways.straight.w[1];
                tiles[this.generate.getIndexFromCoords(map, cornerX - 1, cornerY)] = this.tiles.highways.straight.n[1];
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY)] = this.tiles.highways.corner;
                // fix edge caps
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY)] = this.tiles.highways.edge_caps.w;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY + 1)] = this.tiles.highways.edge_caps.n;
                break;
            case "ne":
                var cornerX = map.units - 1;
                var cornerY = 2;
                // fix the corner roads
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY - 1)] = this.tiles.highways.open;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY - 1)] = this.tiles.highways.straight.w[1];
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY)] = this.tiles.highways.straight.s[0];
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY)] = this.tiles.highways.corner;
                // fix edge caps
                tiles[this.generate.getIndexFromCoords(map, cornerX - 1, cornerY)] = this.tiles.highways.edge_caps.e;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY + 1)] = this.tiles.highways.edge_caps.n;
                break;
            case "se":
                var cornerX = map.units - 1;
                var cornerY = map.units - 1;
                // fix the corner roads
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY + 1)] = this.tiles.highways.open;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY - 1)] = this.tiles.highways.straight.w[1];
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY)] = this.tiles.highways.straight.s[0];
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY)] = this.tiles.highways.corner;
                // fix edge caps
                tiles[this.generate.getIndexFromCoords(map, cornerX - 1, cornerY)] = this.tiles.highways.edge_caps.e;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY + 1)] = this.tiles.highways.edge_caps.n;
                break;
            case "se":
                var cornerX = map.units - 1;
                var cornerY = map.units - 1;
                // fix the corner roads
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY + 1)] = this.tiles.highways.open;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY + 1)] = this.tiles.highways.straight.e[0];
                tiles[this.generate.getIndexFromCoords(map, cornerX - 1, cornerY)] = this.tiles.highways.straight.s[1];
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY)] = this.tiles.highways.corner;
                // fix edge caps
                tiles[this.generate.getIndexFromCoords(map, cornerX + 1, cornerY)] = this.tiles.highways.edge_caps.w;
                tiles[this.generate.getIndexFromCoords(map, cornerX, cornerY - 1)] = this.tiles.highways.edge_caps.s;
                break;
        }
        return tiles;
    }

    // joins together highways and roads
    joinRoadHighway(map, tiles, x, y, direction) {
        switch (direction) {
            case "n":
                // set join piece
                tiles[this.generate.getIndexFromCoords(map, x, y - 1)] = this.tiles.highways.joins.s;
                // caps
                tiles[this.generate.getIndexFromCoords(map, x - 1, y)] = this.tiles.highways.edge_caps.e;
                tiles[this.generate.getIndexFromCoords(map, x + 1, y)] = this.tiles.highways.edge_caps.w;
                break;
            case "e":
                // set join piece
                tiles[this.generate.getIndexFromCoords(map, x + 1, y)] = this.tiles.highways.joins.w;
                // caps
                tiles[this.generate.getIndexFromCoords(map, x, y - 1)] = this.tiles.highways.edge_caps.s;
                tiles[this.generate.getIndexFromCoords(map, x, y + 1)] = this.tiles.highways.edge_caps.n;
                break;
            case "w":
                // set join piece
                tiles[this.generate.getIndexFromCoords(map, x - 1, y)] = this.tiles.highways.joins.e;
                // caps
                tiles[this.generate.getIndexFromCoords(map, x, y + 1)] = this.tiles.highways.edge_caps.n;
                tiles[this.generate.getIndexFromCoords(map, x, y - 1)] = this.tiles.highways.edge_caps.s;
                break;
            case "s":
                // set join piece
                tiles[this.generate.getIndexFromCoords(map, x, y + 1)] = this.tiles.highways.joins.n;
                // caps
                tiles[this.generate.getIndexFromCoords(map, x - 1, y)] = this.tiles.highways.edge_caps.e;
                tiles[this.generate.getIndexFromCoords(map, x + 1, y)] = this.tiles.highways.edge_caps.w;
                break;
        }
        return tiles;
    }

    displayProblemTiles(tiles, problems) {
        var i = 0;
        while (i < problems.length) {
            tiles[problems[i]] = 43;
            i++;
        }
        return tiles;
    }

    // pass it a map, tiles and an array of problem tiles, and it fixes it
    fixProblemTiles(map, tiles, set, problems) {
        var i = 0;
        // let's work on our tiles one by one
        while (i < problems.length) {
            // this is our desired object
            var needle = { n: false, e: false, w: false, s: false, set: set };

            // check to see if there's a road tile to the north
            var n = (problems[i] - map.units);
            if (tiles[n] != 0) {
                var nX = this.getDirections(tiles[n]);
                if (nX && nX.s == true && nX.set == set) {
                    // this tile to the north needs a south connection (us)
                    needle.n = true;
                }
            }

            // check to see if there's a road tile to the south
            var s = (problems[i] + map.units);
            if (tiles[s] != 0) {
                var sX = this.getDirections(tiles[s]);
                if (sX && sX.n == true && sX.set == set) {
                    // this tile to the south needs a north connection
                    needle.s = true;
                }
            }

            // check to see if there's a road tile to the east
            var e = (problems[i] + 1);
            if (tiles[e] != 0) {
                var eX = this.getDirections(tiles[e]);
                if (eX && eX.w == true && eX.set == set) {
                    // this tile to the east needs a west connection (us)
                    needle.e = true;
                }
            }

            // check to see if there's a road tile to the west
            var w = (problems[i] - 1);
            if (tiles[w] != 0) {
                var wX = this.getDirections(tiles[w]);
                if (wX && wX.e == true && wX.set == set) {
                    // this tile to the west needs an east connection (us)
                    needle.w = true;
                }
            }
        
            // we have our needle, now let's find it!
            var index = this.getIndexFromObj(needle);
            if (index != -1) {
                // we found a match
                tiles[problems[i]] = index;
                if (needle.n === true) { tiles[n] = this.getIndex("ns", "city_intersection"); }
                if (needle.e === true) { tiles[e] = this.getIndex("ew", "city_intersection"); }
                if (needle.w === true) { tiles[w] = this.getIndex("ew", "city_intersection"); }
                if (needle.s === true) { tiles[s] = this.getIndex("ns", "city_intersection"); }
            }
            i++;
        }

        return tiles;
    }

    //finds problems using the n/s tile as the master tile
    findNSProblems(map, tiles) {
        var masterTiles = this.getIndices(["n", "s"]);
        var problemTiles = [];
        var i = 0;
        while (i < tiles.length) {
            if (masterTiles.indexOf(tiles[i]) != -1) {
                var n = i - map.units;
                var s = i + map.units;
                //there's a match, this is a "master tile, let's check its friends
                if (masterTiles.indexOf(tiles[n]) === -1) {
                    //there's i don't recognize what's up there
                    problemTiles.push(n)
                }
                if (masterTiles.indexOf(tiles[s]) === -1) {
                    //there's i don't recognize what's down there
                    problemTiles.push(s)
                }
            }
            i++;
        }
        return problemTiles;
    }

    //finds problems using the e/w tile as the master tile
    findEWProblems(map, tiles) {
        var masterTiles = this.getIndices(["e", "w"]);
        var problemTiles = [];
        var i = 0;
        while (i < tiles.length) {
            if (masterTiles.indexOf(tiles[i]) != -1) {
                var e = i + 1;
                var w = i - 1;
                //there's a match, this is a "master tile, let's check its friends
                if (masterTiles.indexOf(tiles[e]) == -1) {
                    //there's i don't recognize what's up there
                    problemTiles.push(e)
                }
                if (masterTiles.indexOf(tiles[w]) == -1) {
                    //there's i don't recognize what's down there
                    problemTiles.push(w)
                }
            }
            i++;
        }
    }

    //give it an array of directions and it will tell you which piece fits the bill
    getIndex(directions, set) {
        var i = 0;
        var needle = {
            n: directions.indexOf("n") != -1 ? true : false,
            e: directions.indexOf("e") != -1 ? true : false,
            w: directions.indexOf("w") != -1 ? true : false,
            s: directions.indexOf("s") != -1 ? true : false,
            set: set
        }
        return this.getIndexFromObj(needle);
    }

    getIndexFromObj(needle): number {
        for (var key in this.tiles.roads) {
            if (this.tiles.roads.hasOwnProperty(key)) {
                if (this.compareJSON(this.tiles.roads[key], needle)) {
                    return parseInt(key);
                }
            }
        }
        return -1;
    }

    //give it an array of directions and it will tell you which pieces fits the bill (no set required)
    getIndices(directions) {
        var needles = [];
        var needle = {
            n: directions.indexOf("n") != -1 ? true : false,
            e: directions.indexOf("e") != -1 ? true : false,
            w: directions.indexOf("w") != -1 ? true : false,
            s: directions.indexOf("s") != -1 ? true : false
        }
        for (var key in this.tiles.roads) {
            if (this.tiles.roads[key].n == needle.n && this.tiles.roads[key].s == needle.s) {
                if (this.tiles.roads[key].e == needle.e && this.tiles.roads[key].w == needle.w) {
                    //this piece is the piece we want
                    needles.push(parseInt(key));
                }
            }
        }
        return needles;
    }

    // give it an index, and it will return a direction object back to you
    getDirections(index) {
        return this.tiles.roads[index];
    }

    compareJSON(a, b): boolean {
        return (JSON.stringify(a) === JSON.stringify(b));
    }

    arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }

        return a;
    }
}