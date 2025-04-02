// Function to create a simple audio visualizer using the Web Audio API
/*
1. Two main typed arrays are used:
- timeDataArray: A Uint8Array that stores waveform data (time domain)
- frequencyDataArray: A Uint8Array that stores spectrum data (frequency domain)

2. Methods like getByteTimeDomainData() and getByteFrequencyData() fill these typed arrays with audio data
3. The applySimpleGain() function shows how to directly modify audio samples using Float32Array (another typed array)

The benefits of using typed arrays for audio processing include:
* Efficient memory usage (fixed-size buffers appropriate for the data type)
* Direct manipulation of binary data for better performance
* Ability to perform fast mathematical operations on large sets of audio samples
* Seamless integration with Web Audio API and other binary data sources
*/
function createAudioVisualizer(audioElement) {
    // Create audio context. The fallback with webkitAudioContext handles browser compatibility
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Create audio source from the audio element
    //createMediaElementSource connects the HTML audioElement to Web Audio API
    const source = audioContext.createMediaElementSource(audioElement);

    // Create an analyzer node to access audio data, that can extract frequency and time data
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048; // FFT size determines the frequency domain resolution. Fast Fourier Transform(2048 samples)- larger value give more detailed frequency analysis

    // Connect the source to the analyzer and then to the destination (speakers)
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    // Create typed arrays to store the audio data
    const bufferLength = analyzer.frequencyBinCount; // Usually half of fftSize

    // Create arrays to store time domain and frequency domain data
    const timeDataArray = new Uint8Array(bufferLength); //value [0-255]
    const frequencyDataArray = new Uint8Array(bufferLength); //value [0-255]

    // Set up the canvas for visualization
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Function to draw the visualization
    function drawVisualizer() {
      requestAnimationFrame(drawVisualizer);        //to create a smooth animation loop

      // Get time domain data (waveform)
      analyzer.getByteTimeDomainData(timeDataArray);    //getBytTimeDomainData fill timeDataArray with current wave data

      // Get frequency domain data (spectrum)
      analyzer.getByteFrequencyData(frequencyDataArray);    //getByteFrequencyData fill frequencyDataArray with current frequency data

      // Clear the canvas
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the waveform (top half)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 255, 0)';
      //Start draw Waveform
      ctx.beginPath();

      const waveformHeight = canvas.height / 2;
      const waveformSliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeDataArray[i] / 128.0; // normalize to [0, 2], normalizes value (dividing by 128) to center waveform
        const y = v * waveformHeight / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += waveformSliceWidth;
      }

      ctx.stroke();
      //End Draw Waveform

      // Draw the frequency spectrum (bottom half)
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = frequencyDataArray[i] / 2;

        // Use frequency to determine color
        const r = barHeight + 100;
        const g = 50;
        const b = 150;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    }

    // Add controls to start/pause the audio
    const playButton = document.createElement('button');
    playButton.textContent = 'Play/Pause';
    playButton.addEventListener('click', () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (audioElement.paused) {
        audioElement.play();
        drawVisualizer();
      } else {
        audioElement.pause();
      }
    });

    document.body.insertBefore(playButton, canvas);

    // return analyzer node and both typed arrays to allow the caller to access the audio data.
    return {
      analyzer,
      timeDataArray,
      frequencyDataArray
    };
  }

  // Example usage
  document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById('audioElement');
    const visualizer = createAudioVisualizer(audioElement);

    // Example of how to process audio data directly
    function applySimpleGain(audioBuffer, gainFactor) {
      // Get raw audio data as Float32Array
      const numChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length;

      for (let channel = 0; channel < numChannels; channel++) {
        // Get the audio data for this channel
        const channelData = audioBuffer.getChannelData(channel);

        // Apply gain to each sample
        for (let i = 0; i < length; i++) {
          // Typed arrays allow direct manipulation of binary data
          channelData[i] = Math.min(1.0, Math.max(-1.0, channelData[i] * gainFactor));
        }
      }

      return audioBuffer;
    }
  });