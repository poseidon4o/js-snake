var snake = require('./src/snake.js');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/frontend'));
app.use('/src', express.static(__dirname + '/src'));



var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8090);


var GAME_SPEED = 150;

var game = new snake.SnakeBoard(new snake.Coord(snake.GAME_SIZE[0], snake.GAME_SIZE[1]));
game.spawn_food();
console.log('Game created');

io.on('connection', function (socket) {
    var id = game.spawn_snake();

    var game_ticker = setInterval(function() {
        game.update();
        socket.emit('update', {id: id, game: game});
    }, GAME_SPEED);


    socket.on('input', function(dir) {
        game.snakes[id].turn(dir);
    });

    socket.on('disconnect', function() {
        console.log('Game ended');
        game.remove_snake(id);
        clearInterval(game_ticker);
    });
});