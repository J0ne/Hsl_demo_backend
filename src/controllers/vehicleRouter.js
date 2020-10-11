const vehicleRouter = require('express').Router();
const { connectTo } = require('../clients/mqttClient');


vehicleRouter.get('/', async (request, response) => {
    response.json(vehicleTypes);
});

vehicleRouter.post('/', async (request, response) => {
    const body = request.body;
    const vehicleType = body.type;
    connectTo(vehicleType);
    // 202 Accepted
    response.status(202).json(true);
});

const vehicleTypes = [ 'tram', 'train', 'bus'];

module.exports = vehicleRouter;


