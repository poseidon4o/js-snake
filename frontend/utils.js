var DIRECTION = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}

function Coord (x, y) {
    this.x = parseInt(x, 10);
    this.y = parseInt(y, 10);
}

Coord.prototype.clone = function() {
    return new Coord(this.x, this.y);
}

function coord_eq(left, right) {
    return left.x === right.x && left.y === right.y;
}

function random(from, to) {
    return Math.random() * (to - from) + from;
}

