function DrawSystem (canvas_id, size) {
    this.canvas = document.getElementById(canvas_id);

    var width = document.body.clientWidth;
    var height = document.body.clientHeight - this.canvas.clientTop;


    this.canvas.width = 1000;
    this.canvas.height = 700;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = "#000000";
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 2;

    this.cell_size = [this.canvas.width / size.x, this.canvas.height / size.y];

    this.board = new SnakeBoard(size);
}

DrawSystem.prototype.draw = function(me, clients) {
    var rect = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#ff0000";
    if (this.board.food !== null) {
        rect = this._coord_to_rect(this.board.food);
        this.ctx.fillRect(rect[0][0], rect[0][1], rect[1][0], rect[1][1]);
    }

    clients.forEach(function (client) {
        this.ctx.fillStyle = client.color;
    
        this.board.snakes[client.id].parts.forEach(function draw_snake_parts(part) {
            rect = this._coord_to_rect(part);
            this.ctx.fillRect(rect[0][0], rect[0][1], rect[1][0], rect[1][1]);
        }, this);

    }, this);

    this.ctx.stroke();
}

DrawSystem.prototype._coord_to_rect = function(coord) {
    return [
        [coord.x * this.cell_size[0], coord.y * this.cell_size[1]], 
        this.cell_size
    ];
}