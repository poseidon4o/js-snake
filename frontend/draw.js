function SnakeSystem (canvas_id, size) {
    this.canvas = document.getElementById(canvas_id);

    var width = document.body.clientWidth;
    var height = document.body.clientHeight - this.canvas.clientTop;


    this.canvas.height = 500;
    this.canvas.width = 500;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = "#000000";
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 1;

    this.cell_size = new Coord(this.canvas.width / size.x, this.canvas.height / size.y);

    this.board = new SnakeBoard(size);
    this.board.spawn_snake(new Coord(size.x / 2, size.y / 2));
    this.board.spawn_food();
}

SnakeSystem.prototype.update = function() {
    this.board.update();
}

SnakeSystem.prototype.draw = function() {
    var rect = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#ff0000";
    if (this.board.food !== null) {
        rect = this._coord_to_rect(this.board.food);
        this.ctx.fillRect(rect[0].x, rect[0].y, rect[1].x, rect[1].y);
    }

    this.ctx.fillStyle = "#000000";
    if (this.board.snake !== null) {
        for(var c = 0; c < this.board.snake.parts.length; ++c) {
            rect = this._coord_to_rect(this.board.snake.parts[c]);
            this.ctx.fillRect(rect[0].x, rect[0].y, rect[1].x, rect[1].y);
        }
    }

    this.ctx.stroke();
}

SnakeSystem.prototype._coord_to_rect = function(coord) {
    return [new Coord(coord.x * this.cell_size.x, coord.y * this.cell_size.y), this.cell_size.clone()];
}