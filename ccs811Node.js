'use strict';

/**
 * Wraps the ccs811 driver in node-red wrapper
 * @param  {} RED node-red wrapper
 */
module.exports = function (RED) {
    const CCS811 = require('ccs811');

    /**
     * This function creates the node and corresponding to html file
     * @param  {} n links variables from html files
     */
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

        /**
         * Initialize ccs811
         */
        const sensorInit = () => {
            node.sensor.init().then(function () {
                node.initialized = true;
                node.status({ fill: "green", shape: "dot", text: "CCS811 Initialized." }); // show green dot at node if successful
                node.log("CCS811 Initialized.");
            }).catch(function (err) {
                node.status({ fill: "red", shape: "ring", text: "Initialization failed." }); // show red ring at node if successful
                node.error("Initialization failed. ->" + err);
            });
        };

        /**
         * Get readings from ccs811
         * @param  {object} msg payload object containing the data
         */
        const sensorReading = (msg) => {
          node.sensor.readSensorData()
            .then((data) => {
              msg.payload = data;
              node.send(msg); // send the payload
              let TVOC = node.type + "[TVOC :" + Math.round(data.TVOC);
              node.status({ fill: "green", shape: "dot", text: TVOC + " ppb]" }); // display tvoc at the node if successful
            })
            .catch((err) => {
              node.status({ fill: "red", shape: "ring", text: "CCS811 reading failed." }); // display error at the node if successful
              node.error("CCS811 reading failed ->" + err);
            });
            return null;
        };

        // Init
        sensorInit();

        /**
         * @param  {} 'input' the node an input for trigger measures
         * @param  {object} msg payload object containing data
         */
        node.on('input', function (msg) {
            if (!node.initialized) {
                // repeat initialization if failed
                sensorInit();
                return null;
            }
            sensorReading(msg);
          });
    }
    // register the node
    RED.nodes.registerType("ccs811", ccs811);
};