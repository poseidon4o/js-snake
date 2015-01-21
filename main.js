var snake = require('./src/snake.js');
var express = require('express');
var app = express();
var escaper = require('html-escape');

app.use(express.static(__dirname + '/frontend'));
app.use('/src', express.static(__dirname + '/src'));



var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8090);


var GAME_SPEED = 80;
var COLORS = ["#808080", "#000000", "#800000", "#FFFF00", 
              "#808000", "#00FF00", "#008000", "#00FFFF",
              "#008080", "#0000FF", "#FF00FF", "#800080"];


var game = new snake.SnakeBoard(new snake.Coord(snake.GAME_SIZE[0], snake.GAME_SIZE[1]));
game.spawn_food();
console.log('Game created');

var clients = [];

var game_ticker = setInterval(function() {
    game.update();
    io.sockets.emit('update', {game: game});
}, GAME_SPEED);

function update_all() {
    io.sockets.emit('clients-update', clients);
}


io.on('connection', function (socket) {
    var me = {
        id: null,
        color: null,
        name: ''
    };

    socket.on('register', function(data) {
        if (data.name.length < 1) {
            socket.emit('dc', 'name too short');
            socket.disconnect();
            return;
        }
        if (!COLORS.length) {
            socket.emit('dc', "No room");
            socket.disconnect();
            return;
        }

        for (var c = 0; c < clients.length; ++c) {
            if (clients[c].name === data.name) {
                socket.emit('dc', "Name taken");
                socket.disconnect();
                return;
            }
        }
        name = escaper(data.name).substr(0, 20);
        me.name = name;
        me.id = game.spawn_snake();
        me.color = COLORS.pop();
        
        clients.push(me);
        update_all();
        socket.emit('set-id', me.id);
    });

    socket.on('input', function(dir) {
        game.snakes[me.id].turn(dir);
    });

    socket.on('disconnect', function() {
        if (clients[me.id] === undefined) {
            return;
        }


        COLORS.push(clients[me.id].color);

        for (var c = me.id + 1; c < clients.length; ++c) {
            clients[c].id--;
        }

        clients.splice(me.id, 1);
        game.snakes.splice(me.id, 1);

        update_all();
    });
});
