// WebSocket Binary Communication Example
// This example demonstrates sending and receiving binary data with WebSockets using TypedArrays

// Client-side code

class BinaryWebSocketClient {
    constructor(url) {
      this.url = url;
      this.socket = null;
      this.connected = false;
      this.messageHandlers = new Map();
    }

    // Connect to WebSocket server
    connect() {
      return new Promise((resolve, reject) => {
        this.socket = new WebSocket(this.url);

        // Set binary type to arraybuffer to receive binary data
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.connected = true;
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          this.connected = false;
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.socket.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
          } else {
            console.log('Received text message:', event.data);
          }
        };
      });
    }

    // Close the WebSocket connection
    disconnect() {
      if (this.socket && this.connected) {
        this.socket.close();
      }
    }

    // Register a handler for a specific message type
    registerHandler(messageType, handler) {
      this.messageHandlers.set(messageType, handler);
    }

    // Handle incoming binary messages
    handleBinaryMessage(arrayBuffer) {
      // First byte is message type
      const view = new Uint8Array(arrayBuffer);
      const messageType = view[0];

      // Get handler for this message type
      const handler = this.messageHandlers.get(messageType);
      if (handler) {
        handler(arrayBuffer.slice(1)); // Pass the payload (excluding type byte)
      } else {
        console.warn(`No handler registered for message type: ${messageType}`);
      }
    }

    // Send a binary message with header and payload
    sendBinaryMessage(messageType, data) {
      if (!this.connected) {
        throw new Error('WebSocket is not connected');
      }

      // Create an ArrayBuffer for the entire message
      // 1 byte for message type + data length
      const messageBuffer = new ArrayBuffer(1 + data.byteLength);
      const messageView = new Uint8Array(messageBuffer);

      // Set message type
      messageView[0] = messageType;

      // Copy data to the message buffer
      messageView.set(new Uint8Array(data), 1);

      // Send the binary message
      this.socket.send(messageBuffer);
    }

    // Example: Send position update (x, y, z coordinates as Float32)
    sendPositionUpdate(x, y, z) {
      const MESSAGE_TYPE_POSITION = 1;

      // Create buffer for 3 float values (4 bytes each)
      const positionBuffer = new ArrayBuffer(3 * 4);
      const positionView = new DataView(positionBuffer);

      // Write float values with little-endian byte order
      positionView.setFloat32(0, x, true);
      positionView.setFloat32(4, y, true);
      positionView.setFloat32(8, z, true);

      // Send binary message
      this.sendBinaryMessage(MESSAGE_TYPE_POSITION, positionBuffer);
    }

    // Example: Send player action (action ID and parameter)
    sendPlayerAction(actionId, parameter) {
      const MESSAGE_TYPE_ACTION = 2;

      // Create buffer for 1 uint8 and 1 float32
      const actionBuffer = new ArrayBuffer(1 + 4);
      const actionView = new DataView(actionBuffer);

      // Write action ID and parameter
      actionView.setUint8(0, actionId);
      actionView.setFloat32(1, parameter, true);

      // Send binary message
      this.sendBinaryMessage(MESSAGE_TYPE_ACTION, actionBuffer);
    }

    // Example: Send chat message (binary format for efficient networking)
    sendChatMessage(message) {
      const MESSAGE_TYPE_CHAT = 3;

      // Convert string to UTF-8 encoded array
      const encoder = new TextEncoder();
      const encodedMessage = encoder.encode(message);

      // Send binary message
      this.sendBinaryMessage(MESSAGE_TYPE_CHAT, encodedMessage.buffer);
    }
  }

  // Example: Handling different binary message types
  function setupMessageHandlers(client) {
    // Handler for position updates
    client.registerHandler(1, (payload) => {
      const dataView = new DataView(payload);

      // Read 3 float values
      const x = dataView.getFloat32(0, true);
      const y = dataView.getFloat32(4, true);
      const z = dataView.getFloat32(8, true);

      console.log(`Position update: (${x}, ${y}, ${z})`);
      updatePlayerPosition(x, y, z);
    });

    // Handler for entity state updates
    client.registerHandler(2, (payload) => {
      const dataView = new DataView(payload);

      // Read entity ID
      const entityId = dataView.getUint16(0, true);

      // Read number of state properties
      const propertyCount = dataView.getUint8(2);

      // Parse properties
      const properties = {};
      let offset = 3;

      for (let i = 0; i < propertyCount; i++) {
        // Property format: 1 byte ID, 1 byte type, variable length value
        const propertyId = dataView.getUint8(offset++);
        const propertyType = dataView.getUint8(offset++);

        let value;
        switch (propertyType) {
          case 0: // Boolean
            value = dataView.getUint8(offset) !== 0;
            offset += 1;
            break;
          case 1: // Integer
            value = dataView.getInt32(offset, true);
            offset += 4;
            break;
          case 2: // Float
            value = dataView.getFloat32(offset, true);
            offset += 4;
            break;
        }

        properties[propertyId] = value;
      }

      console.log(`Entity ${entityId} state update:`, properties);
      updateEntityState(entityId, properties);
    });

    // Handler for chat messages
    client.registerHandler(3, (payload) => {
      // Convert UTF-8 array back to string
      const decoder = new TextDecoder();
      const message = decoder.decode(payload);

      console.log(`Chat message: ${message}`);
      displayChatMessage(message);
    });

    // Handler for binary data (e.g., compressed texture)
    client.registerHandler(4, (payload) => {
      // Decompress the binary data
      const compressedData = new Uint8Array(payload);

      // Process the compressed data (example)
      processCompressedData(compressedData);
    });
  }

  // Mock functions for examples
  function updatePlayerPosition(x, y, z) {
    // Update player position in game/application
    console.log(`Player moved to (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`);
  }

  function updateEntityState(entityId, properties) {
    // Update entity state in game/application
    console.log(`Entity ${entityId} updated with properties:`, properties);
  }

  function displayChatMessage(message) {
    // Display chat message in UI
    console.log(`New chat message: ${message}`);
  }

  function processCompressedData(data) {
    // Process compressed binary data
    console.log(`Processing ${data.length} bytes of compressed data`);
  }

  // Example usage
  async function runExample() {
    try {
      // Create client and connect
      const client = new BinaryWebSocketClient('wss://example.com/binary-socket');

      // Set up message handlers
      setupMessageHandlers(client);

      // Connect to server
      await client.connect();

      // Send various binary messages
      client.sendPositionUpdate(125.4, 28.7, -45.2);
      client.sendPlayerAction(7, 0.75); // Action 7 with parameter 0.75
      client.sendChatMessage("Hello, this is a binary-encoded chat message!");

      // Example of receiving data: normally this would come from the server
      // This simulates receiving a position update message
      const simulatedMessage = new ArrayBuffer(13);
      const msgView = new DataView(simulatedMessage);
      msgView.setUint8(0, 1); // Message type 1 (position)
      msgView.setFloat32(1, 130.5, true); // x
      msgView.setFloat32(5, 30.2, true);  // y
      msgView.setFloat32(9, -50.1, true); // z

      // Simulate receiving this message
      client.handleBinaryMessage(simulatedMessage);

      // Later, disconnect
      setTimeout(() => {
        client.disconnect();
        console.log('Disconnected from server');
      }, 5000);

    } catch (error) {
      console.error('Error in WebSocket example:', error);
    }
  }

  // Call the example
  // runExample();

  // ---------------------------------------------------------------------------
  // Server-side code (Node.js example with ws library)
  // ---------------------------------------------------------------------------

  /*
  // This would be in a separate server.js file:

  const WebSocket = require('ws');

  const server = new WebSocket.Server({ port: 8080 });

  server.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
      // Handle binary message
      if (message instanceof Buffer) {
        const messageType = message[0];
        const payload = message.slice(1);

        console.log(`Received binary message type: ${messageType}, length: ${payload.length}`);

        // Process based on message type
        switch (messageType) {
          case 1: // Position update
            if (payload.length >= 12) {
              const x = payload.readFloatLE(0);
              const y = payload.readFloatLE(4);
              const z = payload.readFloatLE(8);
              console.log(`Position update: (${x}, ${y}, ${z})`);

              // Broadcast to other clients if needed
              server.clients.forEach((client) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                  client.send(message);
                }
              });
            }
            break;

          case 2: // Player action
            // Process player action
            break;

          case 3: // Chat message
            // Process and broadcast chat message
            const chatMessage = Buffer.from(payload).toString('utf8');
            console.log(`Chat message: ${chatMessage}`);
            break;
        }
      } else {
        console.log('Received text message:', message);
      }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server running on port 8080');
  */