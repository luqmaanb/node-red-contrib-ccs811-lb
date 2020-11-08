'use strict';

module.exports = function (RED) {
    const CCS811 = require('ccs811');

    function ccs811(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        node.bus = parseInt(n.bus);
        node.addr = parseInt(n.address, 16);
        node.topic = n.topic || "";
        node.initialized = false;

        // init the sensor
        node.status({ fill: "grey", shape: "ring", text: "Initializing CCS811..." });
        node.log("Initializing on bus" + node.bus + " addr:" + node.addr);
        const i2cSettings = {
          i2cBusNo   : node.bus,
          i2cAddress : node.addr
        };

        node.sensor = new CCS811(i2cSettings);

        const sensorInit = () => {
            node.sensor.init().then(function () {
                node.initialized = true;
                node.status({ fill: "green", shape: "dot", text: "CCS811 Initialized." });
                node.log("CCS811 Initialized.");
            }).catch(function (err) {
                node.status({ fill: "red", shape: "ring", text: "Initialization failed." });
                node.error("Initialization failed. ->" + err);
            });
        };

        const sensorReading = (msg) => {
          node.sensor.readSensorData()
            .then((data) => {
              msg.payload = data;
              node.send(msg);
              let TVOC = node.type + "[TVOC :" + Math.round(data.TVOC);
              node.status({ fill: "green", shape: "dot", text: TVOC + "°C]" });
            })
            .catch((err) => {
              node.status({ fill: "red", shape: "ring", text: "CCS811 reading failed." });
              node.error("CCS811 reading failed ->" + err);
            });
            return null;
        };

        // Init
        sensorInit();
        // trigger measure
        node.on('input', function (msg) {
            if (!node.initialized) {
                //try to reinit node until no sensor is found
                sensorInit();
                return null;
            }
            sensorReading(msg);
          });
    }
    RED.nodes.registerType("ccs811", ccs811);
};