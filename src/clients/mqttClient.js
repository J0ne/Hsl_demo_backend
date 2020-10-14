const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://mqtt.hsl.fi:1883/");

let currentTopic = '/hfp/v2/journey/ongoing/vp/tram/+/+/+/+/+/+/+/+/#';
mqttClient.on("connect", function () {
  mqttClient.subscribe(currentTopic, function (
    err
  ) {
    if (!err) {
      mqttClient.publish("presence", "Hello mqtt");
    }
  });
});

const _unsubscribe = () => {
    if(currentTopic){
        console.log('removing current topic...', currentTopic)
        mqttClient.unsubscribe(currentTopic);
    }
}
const connectTo = (type) => {

    if(!type) return;
    _unsubscribe();
    
    const newTopic = `/hfp/v2/journey/ongoing/vp/${type}/+/+/+/+/+/+/+/4/#`;
    mqttClient.subscribe(newTopic, function (err) {
      if (!err) {
        console.log("Subscribed to ", newTopic);
        currentTopic = newTopic;
      }
    });
    console.log(mqttClient._resubscribeTopics)
    return { topics: mqttClient._resubscribeTopics };
}
module.exports.mqttClient = mqttClient;
module.exports.connectTo = connectTo;