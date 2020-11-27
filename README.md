# node-red-contrib-ccs811-lb

This is a node-red wrapper for the ccs811. It uses I2C as communicating protocol. Hardware know-how is assumed.

## Installation

This is not an official node.js module hence it will need to be installed from github.

1. Navigate to the node-red root directory ```cd ~/.node-red``` on your linux platform
2. Install the module ```npm install luqmaanb/node-red-contrib-ccs811-lb```
3. Stop node-red ```node-red-stop```
4. Start node-red ```node-red-start```

## Example Flow

```json
[{
	"id": "da2d366f.a12ba8",
	"type": "tab",
	"label": "Flow 5",
	"disabled": false,
	"info": ""
}, {
	"id": "b7ff7587.a43468",
	"type": "ccs811",
	"z": "da2d366f.a12ba8",
	"name": "",
	"bus": "1",
	"address": "0x5A",
	"topic": "ccs811",
	"x": 420,
	"y": 320,
	"wires": [
		["9e652fde.a07a1"]
	]
}, {
	"id": "b0130dee.37a7a",
	"type": "inject",
	"z": "da2d366f.a12ba8",
	"name": "",
	"props": [{
		"p": "payload"
	}, {
		"p": "topic",
		"vt": "str"
	}],
	"repeat": "1",
	"crontab": "",
	"once": false,
	"onceDelay": 0.1,
	"topic": "",
	"payload": "",
	"payloadType": "date",
	"x": 260,
	"y": 320,
	"wires": [
		["b7ff7587.a43468"]
	]
}, {
	"id": "9e652fde.a07a1",
	"type": "debug",
	"z": "da2d366f.a12ba8",
	"name": "",
	"active": true,
	"tosidebar": true,
	"console": false,
	"tostatus": false,
	"complete": "false",
	"statusVal": "",
	"statusType": "auto",
	"x": 590,
	"y": 320,
	"wires": []
}]
```

## Usage

1. Import the flow above into node-red

2. Screenshot of nodes

![image](extras/ccs811Flow.png)

3. Select the I2C address from the drop down menu. Raspberry Pi uses bus 1.

![image](extras/ccs811I2cConfig.png)

4. Flow output

![image](extras/ccs811FlowOutput.png)

