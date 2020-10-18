const app = require("express")();
const server = require("http").createServer(app);

const bodyParser = require("body-parser");
const cors = require("cors");
const vehicleRouter = require('./controllers/vehicleRouter');
const io = require("socket.io")(server);
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

mqttClient.on("message", function (topic, message) {
  // Buffer-olio
  const mes = JSON.parse(message.toString()).VP;
    //console.log(mes)
  const includesLocation = mes.lat && mes.long;
  // tehdään konvertointeja ja täällä: frontendin kuorma kevenee
  if(includesLocation){
    const vehicleDTO = {
      speed: Math.round(mes.spd * 3.6), // m/s -> km/h
      location: { lat: mes.lat, lon: mes.long },
      routeNumber: mes.desi,
      veh: mes.veh, // dokumentaation mukaan "veh" joillakin operaattoireilla päällekkäisiä numeroita > 
      dl: mes.dl,
    };
    console.log(vehicleDTO)
    io.emit(VEHICLE_EVENT, vehicleDTO);
  }
  

  
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
