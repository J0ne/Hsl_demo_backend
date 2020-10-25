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
  console.log(mes)
  const includesLocation = mes.lat && mes.long;
  // tehdään konvertointeja ja täällä: frontendin kuorma kevenee
  // mes.length < 3 <- tietomäärää pienemmäksi jätetään bussiliikennettä pois
  if(includesLocation && mes.desi.length < 3){
    const vehicleDTO = {
        id: `${mes.oper}${mes.veh}`,
        speed: Math.round(mes.spd * 3.6), // m/s -> km/h
      location: { lat: mes.lat, lon: mes.long },
      route: mes.desi,
      veh: mes.veh, // dokumentaation mukaan "veh" joillakin operaattoireilla päällekkäisiä numeroita > 
      dl: Math.round( mes.dl/60) , // s -> min
      operatorId: mes.oper,
      operatorName: operators.find( o => o.id === mes.oper).name
    };
    //console.log(vehicleDTO)
    io.emit(VEHICLE_EVENT, vehicleDTO);
  }
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const operators = [
  { id: 6, name: "Oy Pohjolan Liikenne Ab" },
  { id: 12, name: "Helsingin Bussiliikenne Oy" },
  { id: 17, name: "Tammelundin Liikenne Oy" },
  { id: 18, name: "Pohjolan Kaupunkiliikenne Oy" },
  { id: 20, name: "Bus Travel Åbergin Linja Oy" },
  { id: 21, name: "Bus Travel Oy Reissu Ruoti" },
  { id: 22, name: "Nobina Finland Oy" },
  { id: 30, name: "Savonlinja Oy" },
  { id: 36, name: "Nurmijärven Linja Oy" },
  { id: 40, name: "HKL-Raitioliikenne" },
  { id: 45, name: "Transdev Vantaa Oy" },
  { id: 47, name: "Taksikuljetus Oy" },
  { id: 50, name: "HKL-Metroliikenne" },
  { id: 51, name: "Korsisaari Oy" },
  { id: 54, name: "V-S Bussipalvelut Oy" },
  { id: 55, name: "Transdev Helsinki Oy" },
  { id: 58, name: "Koillisen Liikennepalvelut Oy" },
  { id: 60, name: "Suomenlinnan Liikenne Oy" },
  { id: 59, name: "Tilausliikenne Nikkanen Oy" },
  { id: 89, name: "Metropolia" },
  { id: 90, name: "VR Oy" },
];