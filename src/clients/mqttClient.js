const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://mqtt.hsl.fi:1883/");


mqttClient.on("connect", function () {
  mqttClient.subscribe("/hfp/v2/journey/ongoing/vp/tram/+/+/+/#", function (
    err
  ) {
    if (!err) {
      mqttClient.publish("presence", "Hello mqtt");
    }
  });
});
let currentTopic;
const _unsubscribe = () => {
    if(currentTopic){
        mqttClient.unsubscribe(currentTopic);
    }
}
const connectTo = (type) => {

    if(!type) return;
    
    _unsubscribe();
    
    const newTopic  = `/hfp/v2/journey/ongoing/vp/${type}/+/+/+/#`;
    mqttClient.subscribe(newTopic, function (err) {
      if (!err) {
        mqttClient.publish("presence", "Hello mqtt");
        currentTopic = newTopic;
      }
    });
}
module.exports.mqttClient = mqttClient;
module.exports.connectTo = connectTo;