const vehicleRouter = require('express').Router();
const { connectTo } = require('../clients/mqttClient');


vehicleRouter.get('/', async (request, response) => {
    response.json(vehicleTypes);
});

vehicleRouter.post('/', async (request, response) => {
    const body = request.body;
    const vehicleType = body.type;
    
    const result = connectTo(vehicleType);
    // 202 Accepted
    response.status(202).json(result);
});

const vehicleTypes = [
  { type: "tram", icon: "tram" },
  { type: "train", icon: "directions_railway" },
  { type: "bus", icon: "directions_bus" },
  { type: "metro", icon: "directions_subway" },
  { type: "ferry", icon: "directions_boat" },
  // { type: "ubus", icon: "directions_railway" },
];

module.exports = vehicleRouter;


