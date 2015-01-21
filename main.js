var snake = require('./src/snake.js');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/frontend'));
app.use('/src', express.static(__dirname + '/src'));



var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8090);


var GAME_SPEED = 100;




io.on('connection', function (socket) {
    var size = new snake.Coord(50, 50);
    var game = new snake.SnakeBoard(size);
    game.spawn_snake(new snake.Coord(size.x / 2, size.y / 2));
    game.spawn_food();

    console.log('Game created');

    var game_ticker = setInterval(function() {
        game.update();
        socket.emit('update', {game: game});
    }, GAME_SPEED);


    socket.on('input', function(dir) {
        game.snake.turn(dir);
    });

    socket.on('disconnect', function() {
        console.log('Game ended');
        clearInterval(game_ticker);
    });
});