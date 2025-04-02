//JavaScript typed arrays are array-like objects that provide a mechanism for reading and writing raw binary data
// in memory buffers. Typed arrays are not intended to replace arrays for any kind of functionality. Instead, they
// provide developers with a familiar interface for manipulating binary data. This is useful when interacting with
// platform features, such as audio and video manipulation, access to raw data using WebSockets

/*
To achieve maximum flexibility and efficiency, JavaScript typed arrays split the implementation into buffers and
views. A buffer is an object representing a chunk of data; it has no format to speak of, and offers no mechanism
for accessing its contents. In order to access the memory contained in a buffer, you need to use a view. A view
provides a context — that is, a data type, starting offset, and number of elements.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
https://www.youtube.com/watch?v=UYkJaW3pmj0

Typed Arrays are specialized array-like object that provide a meachanism for reading and writing raw binary data in memory buffer
and used by: Web GL, Canvas, Web Audio API, XMLHttpRequests, Fetch API, WebSockets, Web Works,
Media Source API and File APIs.

ArrayBuffer - is a low-level representation of a generic, fixed-length binary data buffer. It does not directly
provide methods for reading or writing; instead, it must be accessed through typed array views.

SharedArrayBuffer Similar to ArrayBuffer, a SharedArrayBuffer allows multiple threads to access the same binary
data simultaneously, which can lead to race conditions. However, it cannot be transferred between execution contexts.

DataView is a low-level interface that provides methods to read and write different types of data from an ArrayBuffer.
It allows for more flexibility in data handling, including defining the byte order (endianness) for multi-byte data types.

Typed Array Views are specific views that represent data in common numeric formats (e.g., Int8, Uint32). Each type of
typed array has defined limits for data range and size in memory. Typed arrays are fixed in size and do not support methods
that modify their length.
*/

// new Int8Array(length(bytes) | buffer | TypeArray);
// array of 8-bit integer
// most Array methods are available on TypedArrays too

let buffer = new ArrayBuffer(16); //create a 16 bytes buffer
let dv1 = new DataView(buffer); //create a DataView to be able to access/set whole buffer
let dv2 = new DataView(buffer, 10, 3); //start at slot 10, get 3 bytes

dv1.setInt8(11, 42); //put "42" in slot 11 of the buffer through view 1
let num = dv2.getInt8(1);
console.log(num); //retrieve the 42 from the 2nd byte in view2 which was the 11th byte in the buffer

//Different View of the same buffer
let int32View = new Int32Array(buffer);  // 16 x 8 = 128 bits / 32 = 4 elements (4 bytes each) 4 x 8 = 32 bits
let float64View = new Float64Array(buffer); //2 elements ( 8 bytes each)
let uint8View = new Uint8Array(buffer); //16 element (1 byte each)