

function Snake (position, dir) {
    this.parts = [position.clone()]
    this._dir = dir || DIRECTION.UP;
}

Snake.prototype.turn = function(dir) {
    // opposite of current direction?
    if (Math.abs(dir - this._dir) !== 2) {
        this._dir = dir;
    }
}

Snake.prototype.update = function() {
    var newHead = this.parts[0].clone();

    switch(this._dir) {
        case DIRECTION.UP:
            newHead.y -= 1;
            break;
        case DIRECTION.DOWN:
            newHead.y += 1;
            break;
        case DIRECTION.LEFT:
            newHead.x -= 1;
            break;
        case DIRECTION.RIGHT:
            newHead.x += 1;
            break;
        default:
            return;
    }

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
    this.snake = null;
}

SnakeBoard.prototype.spawn_snake = function(position) {
    this.snake = new Snake(position, DIRECTION.RIGHT);
}

SnakeBoard.prototype.spawn_food = function() {
    do {
        this.food = new Coord(parseInt(random(0, this._size.x), 10),
                               parseInt(random(0, this._size.y), 10));
    } while(this.snake.at_position(this.food));
    
}

SnakeBoard.prototype.end = function() {
    this.snake.parts = [new Coord(this._size.x / 2, this._size.y / 2)];    
}

SnakeBoard.prototype.update = function() {
    this.snake.update();
    var head = this.snake.head();
    if (coord_eq(head, this.food)) {
        this.snake.grow();
        this.spawn_food();
    } else if (this.snake.at_tail(head)) {
        this.end();
    }

    if (head.x < 0 || head.y < 0 || head.x >= this._size.x || head.y >= this._size.y) {
        this.end();
    }
}