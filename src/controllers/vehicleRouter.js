const vehicleRouter = require('express').Router();
const { connectTo } = require('../clients/mqttClient');


vehicleRouter.get('/', async (request, response) => {
    response.json(vehicleTypes);
});

vehicleRouter.post('/', async (request, response) => {
    const body = request.body;
    const vehicleType = body.type;
    // todo selectVehicleObj
    const result = connectTo(vehicleType);
    // 202 Accepted
    response.status(202).json(result);
});

const vehicleTypes = [
  { type: "tram" },
  { type: "train" },
  { type: "bus" },
  { type: "metro" },
  { type: "ferry" },
  { type: "ubus" }
];

module.exports = vehicleRouter;


