const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require ('http');
const routes = require('./routes');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://<yourDB:yourPwd>@cluster0-qinh0.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//app.use(cors({ origin: 'endereço do provedor' })) --> usar para maior segurança
app.use(cors());
app.use(express.json());  //use vale para qualquer método
app.use(routes);

server.listen(3333);

//Métodos HTTP: get, post, put, delete
//Tipos de parâmetros:
// Query params: request.query (filtros, ordenação, paginação, ...) => entra na URL
// Route Params: request.params (identificação de recurso na alteração ou remoção)
// Body: request.body (dados para criação ou alteração )

//MongoDB (não relacional) usar MongoDbAtlas
// usuario dev_radar / senha devRadar2020

