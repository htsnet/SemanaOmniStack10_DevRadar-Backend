const socketio = require('socket.io');
const parseStringAsArray = require('./models/utils/parseStringasArray');
const calculateDistance = require('./models/utils/calculateDistance');

const connections = [];
let io;

exports.setupWebSocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        console.log(socket.id);
        console.log(socket.handshake.query);

        // setTimeout(() => {
        //     socket.emit('message', 'Hello OmniStack')
        // }, 3000);

        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs),
        });
    });
}

exports.findConnections = (coordinates, techs) => {
    console.log(connections);
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    });
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        console.log(data);
        io.to(connection.id).emit(message, data);
    })
}