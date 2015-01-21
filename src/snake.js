var GAME_SIZE = [1000/7, 100];

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







function Snake (position, dir) {
    this.parts = [position.clone()]
    this._dir = dir || DIRECTION.UP;
}

snake_from_json = function(json) {
    var snake = new Snake(new Coord(0, 0));
    snake._dir = json._dir;
    snake.parts = [];
    json.parts.forEach(function json_to_snake(part) {
        snake.parts.push(new Coord(part.x, part.y));
    }, snake);
    return snake;
}

Snake.prototype.turn = function(dir) {
    if (this.parts.length > 1 && coord_eq(this.head().add(this._get_coord_at_dir(dir)), this.parts[1])) {
        return;
    }
    this._dir = dir;
}

Snake.prototype._get_coord_at_dir = function(dir) {
    var coord = new Coord(0, 0);
    switch(dir) {
        case DIRECTION.UP:
            coord.y = -1;
            break;
        case DIRECTION.DOWN:
            coord.y = 1;
            break;
        case DIRECTION.LEFT:
            coord.x = -1;
            break;
        case DIRECTION.RIGHT:
            coord.x = 1;
            break;
    }
    return coord;
}

Snake.prototype.update = function() {
    var newHead = this.parts[0].clone().add(this._get_coord_at_dir(this._dir));

    for(var c = this.parts.length - 1; c > 0; --c) {
        this.parts[c] = this.parts[c - 1];
    }
    this.parts[0] = newHead;
}

Snake.prototype.grow = function() {
    this.parts.push(this.parts[this.parts.length - 1].clone());
}

Snake.prototype.head = function() {
    return this.parts[0].clone()
}

Snake.prototype.at_head = function(pos) {
    return coord_eq(pos, this.parts[0]);
}

Snake.prototype.at_tail = function(pos) {
    for(var c = 1; c < this.parts.length; ++c) {
        if (coord_eq(this.parts[c], pos)) {
            return true;
        }
    }
    return false;
}

Snake.prototype.at_position = function(pos) {
    return this.at_head(pos) || this.at_tail(pos);
}






function SnakeBoard (size) {
    this._size = size;
    this.food = null;
    this.snakes = [];
}

snake_board_from_json = function(json) {
    var sb = new SnakeBoard(new Coord(0, 0));

    sb._size = new Coord(json._size.x, json._size.y);
    sb.snakes = [];
    for (var c = 0; c < json.snakes.length; ++c) {
        sb.snakes.push(snake_from_json(json.snakes[c]));
    }

    sb.food = json.food !== null ? new Coord(json.food.x, json.food.y) : null;
    return sb;
}


SnakeBoard.prototype.spawn_food = function() {
    do {
        this.food = new Coord(random(0, this._size.x), random(0, this._size.y));
    } while(this.snakes.length && this.snakes.some(function(snake) { return snake.at_position(this.food)}, this));
}

SnakeBoard.prototype.spawn_snake = function() {
    var coord;
    do {
        coord = new Coord(random(0, this._size.x), random(0, this._size.y));
    } while(this.snakes.length && this.snakes.some(function(snake) { return snake.at_position(this.food)}, this));
    this.snakes.push(new Snake(coord));
    return this.snakes.length - 1;
}

SnakeBoard.prototype.end = function(which) {
    this.snakes[which].parts = [new Coord(this._size.x / 2, this._size.y / 2)];
}

SnakeBoard.prototype.update = function() {
    for (var c = 0; c < this.snakes.length; ++c) {
        this.snakes[c].update();

        var head = this.snakes[c].head();
        if (this.food !== null && coord_eq(head, this.food)) {
            this.snakes[c].grow();
            this.spawn_food();
        } else if (this.snakes[c].at_tail(head)) {
            this.end(c);
        }

        if (head.x < 0 || head.y < 0 || head.x >= this._size.x || head.y >= this._size.y) {
            this.end(c);
        }
    }
}



if(typeof window !== 'undefined'){
    
} else {
    module.exports = {
        GAME_SIZE: GAME_SIZE,
        Coord: Coord,
        DIRECTION: DIRECTION,
        random: random,
        coord_eq: coord_eq,


        Snake: Snake,
        SnakeBoard: SnakeBoard
    }
}