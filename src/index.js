const app = require("express")();
const http = require("http").createServer(app);

const bodyParser = require("body-parser");
const cors = require("cors");
const vehicleRouter = require('./controllers/vehicleRouter');
const io = require("socket.io")(http);
const { mqttClient } = require('./clients/mqttClient')

const VEHICLE_EVENT = "vehicle-event";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/vehicles', vehicleRouter);

io.on('connection', (socket) => {
   socket.on(VEHICLE_EVENT, (msg) => {
     console.log("message: " + msg);
     io.emit(VEHICLE_EVENT, msg);
   });
   socket.broadcast.emit("hi");
});

// client.on("connect", function () {
//   client.subscribe("/hfp/v2/journey/ongoing/vp/tram/+/+/+/#", function (
//     err
//   ) {
//     if (!err) {
//       //client.publish("presence", "Hello mqtt");
//     }
//   });
// });
mqttClient.on("message", function (topic, message) {
  // message is Buffer
  //console.log(message.toString());
  const mes = JSON.parse(message.toString()).VP;
  //console.log(mes.desi, mes.dl )
  io.emit(VEHICLE_EVENT, message.toString());
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
