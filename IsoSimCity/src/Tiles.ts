﻿class Tiles {

    constructor(game: Phaser.Game) {
        game.load.json("data", "./tiles.json");
    }

}
    data = 
    "slices:" {
        "island": [
            [53,42,61],
    [35, 59, 34],
    [60, 27, 68]
    ],
    "hill": [
        [0,10,0],
    [16, 67, 15],
    [0, 22, 0]
    ],
    "paved": [
        [114,80,119],
    [87, 81, 88],
    [118, 95, 122]
    ],
    "grass_road": [
        [123,74,126],
    [82, 0, 82],
    [125, 74, 127]
    ],
    "city_road": [
        [122,73,125],
    [81, 0, 81],
    [124, 73, 126]
    ]
},
"highways": {
    "open": 80,
        "corner": 59,
            "edges": {
        "n": [75, 54],
            "e": [83, 62],
                "w": [83, 62],
                    "s": [75, 54]
    },
    "edge_caps":{
        "n": 61,
            "e": 69,
                "w": 68,
                    "s": 76
    },
    "joins": {
        "n": 93,
            "e": 101,
                "w": 100,
                    "s": 107
    },
    "straight": {
        "n": [86, 87],
            "e": [79, 94],
                "w": [79, 94],
                    "s": [86, 87]
    }
},
"roads": {
    "89": {
        "n": true,
            "e": true,
                "w": true,
                    "s": true,
                        "set": "city_plain"
    },
    "96": {
        "n": false,
            "e": true,
                "w": true,
                    "s": true,
                        "set": "city_plain"
    },
    "88": {
        "n": true,
            "e": false,
                "w": true,
                    "s": true,
                        "set": "city_plain"
    },
    "103": {
        "n": true,
            "e": true,
                "w": true,
                    "s": false,
                        "set": "city_plain"
    },
    "95": {
        "n": true,
            "e": true,
                "w": false,
                    "s": true,
                        "set": "city_plain"
    },
    "122":{
        "n": false,
            "e": true,
                "w": false,
                    "s": true,
                        "set": "city_plain"
    },
    "125":{
        "n": false,
            "e": false,
                "w": true,
                    "s": true,
                        "set": "city_plain"
    },
    "124":{
        "n": true,
            "e": true,
                "w": false,
                    "s": false,
                        "set": "city_plain"
    },
    "126":{
        "n": true,
            "e": false,
                "w": true,
                    "s": false,
                        "set": "city_plain"
    },
    "73":{
        "n": false,
            "e": true,
                "w": true,
                    "s": false,
                        "set": "city_plain"
    },
    "81":{
        "n": true,
            "e": false,
                "w": false,
                    "s": true,
                        "set": "city_plain"
    },
    "56":{
        "n": true,
            "e": false,
                "w": false,
                    "s": true,
                        "set": "city_intersection"
    },
    "64":{
        "n": false,
            "e": true,
                "w": true,
                    "s": false,
                        "set": "city_intersection"
    }
},
"parks":[43, 51, 59, 67],
    "walls":{
    "n": [12, 23],
        "e": [8, 17],
            "s": [7, 16],
                "w": [4, 11],
  },
"buildings": {
    "residential":{
        "red":{
            "bottoms": {
                "n": [92],
                    "e": [36],
                        "s": [30],
                            "w": [106],
        },
            "tops": {
                "ns": [45, 52],
                    "ew": [49, 54]
            }
        },
        "grey":{
            "bottoms": {
                "n": [85],
                    "e": [42],
                        "s": [37],
                            "w": [85],
        },
            "tops": {
                "ns": [50, 55],
                    "ew": [53, 56]
            }
        },
        "brown":{
            "bottoms": {
                "n": [131],
                    "e": [21],
                        "s": [14],
                            "w": [131],
        },
            "tops": {
                "ns": [32, 43],
                    "ew": [38, 47]
            }
        },
        "beige":{
            "bottoms": {
                "n": [130],
                    "e": [29],
                        "s": [22],
                            "w": [130],
        },
            "tops": {
                "ns": [39, 48],
                    "ew": [44, 51]
            }
        },
        "all":{
            "roofs": {
                "n": [59, 64, 66, 73, 75, 77, 89, 91, 105],
                    "e": [61, 68, 70, 80, 82, 84, 96, 112],
                        "s": [58, 63, 65, 72, 74, 76, 88, 90, 104],
                            "w": [57, 60, 62, 67, 69, 71, 81, 83, 97, 98],
                                "all": []
            }
        }
    },
    "commercial":{
        "red":{
            "bottoms": {
                "n": [33, 46, 92],
                    "e": [1, 9, 17, 26, 41, 99],
                        "s": [2, 10, 18, 34, 113, 123],
                            "w": [25, 40, 106],
        },
            "tops": {
                "ns": [16, 23],
                    "ew": [16, 23]
            }
        },
        "grey":{
            "bottoms": {
                "n": [19, 35, 85, 114],
                    "e": [3, 12, 28, 93, 100, 107, 116, 124],
                        "s": [4, 20, 101, 108, 109, 115, 117, 125],
                            "w": [11, 27, 122],
        },
            "tops": {
                "ns": [24, 31],
                    "ew": [24, 31]
            }
        },
        "brown":{
            "bottoms": {
                "n": [131],
                    "e": [],
                        "s": [],
                            "w": [131],
        },
            "tops": {
                "ns": [7, 129],
                    "ew": [7, 129]
            }
        },
        "beige":{
            "bottoms": {
                "n": [130],
                    "e": [],
                        "s": [],
                            "w": [130],
        },
            "tops": {
                "ns": [8, 15],
                    "ew": [8, 15]
            }
        },
        "all":{
            "roofs": {
                "n": [87, 103],
                    "e": [94, 110],
                        "s": [86, 102],
                            "w": [79, 95],
                                "all": [5, 6, 13, 111, 118, 119, 120, 121, 127, 128]
            }
        }
    }
}

