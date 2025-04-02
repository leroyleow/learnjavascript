// Function to convert an image to grayscale using typed arrays
function convertToGrayscale(imageElement) {
  // Create a canvas element to draw the image
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the image
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;

  // Draw the image onto the canvas
  ctx.drawImage(imageElement, 0, 0);

  // Get the image data (RGBA values for each pixel)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // The actual pixel data is stored in imageData.data
  // This is a Uint8ClampedArray with 4 bytes per pixel (R, G, B, A)
  const pixels = imageData.data;

  // Process each pixel
  for (let i = 0; i < pixels.length; i += 4) {
    // Calculate grayscale value using luminance formula
    const gray =
      0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];

    // Set R, G, and B values to the grayscale value
    pixels[i] = gray; // R
    pixels[i + 1] = gray; // G
    pixels[i + 2] = gray; // B
    // We don't modify pixels[i + 3] (Alpha channel)
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Return the canvas with the grayscale image
  return canvas;
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
  const originalImage = document.getElementById("originalImage");

  // Process the image once it's loaded
  originalImage.onload = () => {
    const grayscaleCanvas = convertToGrayscale(originalImage);

    // Add the grayscale image to the page
    document.body.appendChild(grayscaleCanvas);
  };
});
