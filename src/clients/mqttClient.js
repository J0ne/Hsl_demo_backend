const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://mqtt.hsl.fi:1883/");
const TOPIC_BASE = '/hfp/v2/journey/ongoing/vp/';
const TOPIC_SUFFIX = "/+/+/+/+/+/+/+/+/#";

let currentTopic = `${TOPIC_BASE}tram${TOPIC_SUFFIX}`;
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
  if (!type) throw Error('Type is missing or invalid');

  _unsubscribe();
    
  const newTopic = `${TOPIC_BASE}${type}${TOPIC_SUFFIX}`;
  mqttClient.subscribe(newTopic, function (err) {
    if (!err) {
      console.log("Subscribed to ", newTopic);
      currentTopic = newTopic;
    } else{
        throw Error('Subscribing failed, error ', err );
    }
  });
  //console.log(mqttClient._resubscribeTopics);
  return { topics: mqttClient._resubscribeTopics };
}
module.exports.mqttClient = mqttClient;
module.exports.connectTo = connectTo;