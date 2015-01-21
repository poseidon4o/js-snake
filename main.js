var snake = require('./src/snake.js');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/frontend'));
app.use('/src', express.static(__dirname + '/src'));



var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8090);


var GAME_SPEED = 150;
var COLORS = ["#808080", "#000000", "#FF0000", "#800000", "#FFFF00", 
              "#808000", "#00FF00", "#008000", "#00FFFF", "#008080",
              "#0000FF", "#FF00FF", "#800080"];


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
    var client_id, color, name;

    socket.on('register', function(data) {
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


        name = data.name;
        client_id = game.spawn_snake();
        color = COLORS.pop();
        
        clients[client_id] = {
            id: client_id,
            color: color,
            name: data.name
        };

        update_all();
        socket.emit('set-id', client_id);
    });

    socket.on('input', function(dir) {
        for (var c = 0; c < clients.length; ++c) {
            if (clients[c].name === name) {
                game.snakes[clients[c].id].turn(dir);
                break;
            }
        }
    });

    socket.on('disconnect', function() {
        for (var c = 0; c < clients.length; ++c) {
            if (clients[c].name === name) {
                client_id = c;
                break;
            }
        }

        COLORS.push(clients[client_id].color);

        for (var c = client_id + 1; c < clients.length; ++c) {
            clients[c].id--;
        }

        clients.splice(client_id, 1);
        game.snakes.splice(client_id, 1);

        update_all();
    });
});