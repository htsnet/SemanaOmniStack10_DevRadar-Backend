const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../models/utils/parseStringasArray');
const { findConnections, sendMessage } = require('../websocket');

///normalmente tem estas funções: index, show, store, update, destroy

module.exports =  {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude} = (request.body);

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data; //o name = login indica que se o name for nulo, considera o login

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,   //como nome da variável é o do valor, não precisa repetir (short sintax)
                name,  // assim não precisa fazer name: name
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            // Filtrar conexões e procurar as que satisfaçam as condições  do novo dev
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    },

    async destroy(request, response) {
        const { github_username } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (dev) {
            dev = await Dev.deleteOne({
                github_username,   //como nome da variável é o do valor, não precisa repetir (short sintax)
            })
        }

        return response.json(dev);

    },

    async update(request, response) {
        const { github_username, techs } = (request.body);

        let dev = await Dev.findOne({ github_username });

        const techsArray = parseStringAsArray(techs);

        if (dev) {
            dev = await Dev.update({
                github_username,   //como nome da variável é o do valor, não precisa repetir (short sintax)
                techs: techsArray,
            })
        }

        return response.json(dev);

    },


};