// Example: Using TypedArrays with various Web APIs that require binary data

// 1. Fetch API with binary data
async function fetchBinaryData(url) {
    try {
      const response = await fetch(url);

      // Get the binary data as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      console.log('Raw ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');

      // Create different views of the same binary data
      const uint8View = new Uint8Array(arrayBuffer);
      const int32View = new Int32Array(arrayBuffer);
      const float64View = new Float64Array(arrayBuffer);

      console.log('First 10 bytes as uint8:', uint8View.slice(0, 10));
      console.log('First 10 bytes as int32 (4 bytes each):', int32View.slice(0, 3));
      console.log('First 16 bytes as float64 (8 bytes each):', float64View.slice(0, 2));

      return { arrayBuffer, uint8View, int32View, float64View };
    } catch (error) {
      console.error('Error fetching binary data:', error);
    }
  }

  // 2. WebSockets with binary data
  function setupBinaryWebSocket(url) {
    const socket = new WebSocket(url);

    // Set binary type to ArrayBuffer
    socket.binaryType = 'arraybuffer';

    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');

      // Send binary data
      const message = new Uint8Array([1, 2, 3, 4, 5]);
      socket.send(message.buffer);
    });

    socket.addEventListener('message', (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Handle binary message
        const data = new Uint8Array(event.data);
        console.log('Received binary data:', data);

        // Process the binary data...
        processWebSocketBinaryData(data);
      } else {
        // Handle text message
        console.log('Received text message:', event.data);
      }
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return socket;
  }

  function processWebSocketBinaryData(data) {
    // Example: Parsing a binary protocol
    const messageType = data[0];  // First byte indicates message type
    const messageLength = data[1]; // Second byte indicates length
    const messagePayload = data.subarray(2, 2 + messageLength);

    console.log('Message type:', messageType);
    console.log('Message payload:', messagePayload);
  }

  // 3. FileReader API with binary data
  function readBinaryFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        resolve(arrayBuffer);
      };

      reader.onerror = function(event) {
        reject(new Error('File could not be read: ' + event.target.error));
      };

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  }

  // Example: Parse a simple binary file format
  async function parseBinaryFile(file) {
    try {
      const arrayBuffer = await readBinaryFile(file);
      const dataView = new DataView(arrayBuffer);

      // Example: Parse a hypothetical binary file format
      // - First 4 bytes: File signature (ASCII)
      // - Next 4 bytes: Version number (32-bit integer)
      // - Next 8 bytes: Timestamp (64-bit float)
      // - Next 4 bytes: Number of records (32-bit integer)
      // - Remaining: Data records

      // Read file signature (4 ASCII chars)
      const signature = String.fromCharCode(
        dataView.getUint8(0),
        dataView.getUint8(1),
        dataView.getUint8(2),
        dataView.getUint8(3)
      );

      // Read version (32-bit integer, little-endian)
      const version = dataView.getUint32(4, true);

      // Read timestamp (64-bit float, little-endian)
      const timestamp = dataView.getFloat64(8, true);

      // Read record count (32-bit integer, little-endian)
      const recordCount = dataView.getUint32(16, true);

      console.log('File signature:', signature);
      console.log('File version:', version);
      console.log('Timestamp:', new Date(timestamp));
      console.log('Record count:', recordCount);

      // Read records
      const records = [];
      let offset = 20; // Start of records

      for (let i = 0; i < recordCount; i++) {
        // Example record: 2 bytes ID, 4 bytes value
        const recordId = dataView.getUint16(offset, true);
        const recordValue = dataView.getFloat32(offset + 2, true);

        records.push({ id: recordId, value: recordValue });
        offset += 6; // Move to next record
      }

      return { signature, version, timestamp, records };
    } catch (error) {
      console.error('Error parsing binary file:', error);
    }
  }

  // 4. Creating a binary file from scratch
  function createBinaryFile(filename, data) {
    // Calculate buffer size needed
    const headerSize = 20; // 4 + 4 + 8 + 4 bytes for header
    const recordSize = 6;  // 2 + 4 bytes per record
    const totalSize = headerSize + (data.length * recordSize);

    // Create a buffer and DataView
    const buffer = new ArrayBuffer(totalSize);
    const dataView = new DataView(buffer);

    // Write file signature (ASCII "DEMO")
    dataView.setUint8(0, 68); // 'D'
    dataView.setUint8(1, 69); // 'E'
    dataView.setUint8(2, 77); // 'M'
    dataView.setUint8(3, 79); // 'O'

    // Write version (32-bit integer, little-endian)
    dataView.setUint32(4, 1, true);

    // Write timestamp (64-bit float, little-endian)
    dataView.setFloat64(8, Date.now(), true);

    // Write record count (32-bit integer, little-endian)
    dataView.setUint32(16, data.length, true);

    // Write records
    let offset = 20;
    data.forEach((record) => {
      dataView.setUint16(offset, record.id, true);
      dataView.setFloat32(offset + 2, record.value, true);
      offset += 6;
    });

    // Create a Blob from the ArrayBuffer
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 5. Using IndexedDB with binary data
  async function storeBinaryData(key, arrayBuffer) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BinaryDataDB', 1);

      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains('binaryData')) {
          db.createObjectStore('binaryData');
        }
      };

      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['binaryData'], 'readwrite');
        const store = transaction.objectStore('binaryData');

        // Store the ArrayBuffer with the specified key
        const storeRequest = store.put(arrayBuffer, key);

        storeRequest.onsuccess = function() {
          resolve(true);
        };

        storeRequest.onerror = function(error) {
          reject(error);
        };
      };

      request.onerror = function(event) {
        reject(new Error('IndexedDB error: ' + event.target.errorCode));
      };
    });
  }

  async function retrieveBinaryData(key) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BinaryDataDB', 1);

      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['binaryData'], 'readonly');
        const store = transaction.objectStore('binaryData');

        // Retrieve the ArrayBuffer with the specified key
        const getRequest = store.get(key);

        getRequest.onsuccess = function(event) {
          // Convert it to a typed array for processing
          const arrayBuffer = event.target.result;
          if (arrayBuffer) {
            resolve(arrayBuffer);
          } else {
            reject(new Error('No data found for key: ' + key));
          }
        };

        getRequest.onerror = function(error) {
          reject(error);
        };
      };

      request.onerror = function(event) {
        reject(new Error('IndexedDB error: ' + event.target.errorCode));
      };
    });
  }

  // 6. Example usage with Blob API
  function processImageFile(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        const arrayBuffer = event.target.result;

        // Create a typed array to manipulate the image data
        const uint8Array = new Uint8Array(arrayBuffer);

        // Basic analysis of image format
        let format = 'unknown';
        let width = 0;
        let height = 0;

        // Check file signature to determine format
        if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8) {
          // JPEG format
          format = 'JPEG';

          // JPEG dimensions are more complex to extract
          // (would require parsing JPEG segments)
        } else if (
          uint8Array[0] === 0x89 && uint8Array[1] === 0x50 &&
          uint8Array[2] === 0x4E && uint8Array[3] === 0x47
        ) {
          // PNG format
          format = 'PNG';

          // PNG stores width at bytes 16-19 and height at 20-23
          // Both are 32-bit integers, big-endian
          const view = new DataView(arrayBuffer);
          width = view.getUint32(16, false);
          height = view.getUint32(20, false);
        } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46) {
          // GIF format
          format = 'GIF';

          // GIF stores width at bytes 6-7 and height at 8-9
          // Both are 16-bit integers, little-endian
          const view = new DataView(arrayBuffer);
          width = view.getUint16(6, true);
          height = view.getUint16(8, true);
        }

        resolve({ format, width, height, size: arrayBuffer.byteLength });
      };

      reader.onerror = function() {
        reject(new Error('Error reading image file'));
      };

      reader.readAsArrayBuffer(imageFile);
    });
  }

  // Example: Create a checksum for a file
  function calculateChecksum(arrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    let checksum = 0;

    // Simple checksum algorithm (for demonstration)
    for (let i = 0; i < data.length; i++) {
      checksum = (checksum + data[i]) % 0xFFFFFFFF;
    }

    return checksum.toString(16).padStart(8, '0');
  }