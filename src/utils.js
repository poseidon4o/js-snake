var DIRECTION = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}

function Coord (x, y) {
    this.x = x !== undefined ? parseInt(x, 10) : 0;
    this.y = y !== undefined ? parseInt(y, 10) : 0;
}

Coord.prototype.clone = function() {
    return new Coord(this.x, this.y);
}

Coord.prototype.add = function(coord) {
    this.x += coord.x
    this.y += coord.y;
    return this;
}

function coord_eq(left, right) {
    return left.x === right.x && left.y === right.y;
}

function random(from, to) {
    return Math.random() * (to - from) + from;
}

