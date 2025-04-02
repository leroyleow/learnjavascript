// Audio Effects Processor using the Web Audio API and Typed Arrays
class AudioEffectsProcessor {
  constructor(audioContext) {
    this.audioContext =
      audioContext || new (window.AudioContext || window.webkitAudioContext)();
    this.setupNodes();
  }

  setupNodes() {
    // Create audio processing nodes
    this.gainNode = this.audioContext.createGain();
    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.convolver = this.audioContext.createConvolver();
    this.analyser = this.audioContext.createAnalyser();

    // Set default values
    this.gainNode.gain.value = 1.0;
    this.biquadFilter.type = "lowpass";
    this.biquadFilter.frequency.value = 1000;
    this.analyser.fftSize = 2048;

    // Connect the nodes in series
    this.biquadFilter.connect(this.gainNode);
    this.gainNode.connect(this.convolver);
    this.convolver.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  // Connect an audio source
  connectSource(sourceNode) {
    sourceNode.connect(this.biquadFilter);
    return this;
  }

  // Load and create a reverb impulse response
  async createReverb(reverbTimeSeconds = 3.0) {
    // Create an offline audio context for generating impulse response
    const offlineContext = new OfflineAudioContext(
      2,
      this.audioContext.sampleRate * reverbTimeSeconds,
      this.audioContext.sampleRate
    );

    // Create a buffer source for noise
    const noiseBuffer = offlineContext.createBuffer(
      2,
      offlineContext.length,
      offlineContext.sampleRate
    );

    // Fill the buffer with random noise using typed arrays
    for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
      // Get the raw data array for this channel
      const channelData = noiseBuffer.getChannelData(channel);

      // Fill with random values between -1 and 1
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = Math.random() * 2 - 1;
      }
    }

    // Create a gain node to shape the impulse response
    const envelopeGain = offlineContext.createGain();
    envelopeGain.gain.setValueAtTime(1, 0);
    envelopeGain.gain.exponentialRampToValueAtTime(0.001, reverbTimeSeconds);

    // Create source for noise
    const noiseSource = offlineContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Connect and start
    noiseSource.connect(envelopeGain);
    envelopeGain.connect(offlineContext.destination);
    noiseSource.start(0);

    // Render impulse response
    const impulseResponseBuffer = await offlineContext.startRendering();

    // Set the convolver buffer to our generated impulse response
    this.convolver.buffer = impulseResponseBuffer;

    return this;
  }

  // Apply a simple EQ using multiple biquad filters
  applyEQ(bass = 0, mid = 0, treble = 0) {
    // Create three filters for different frequency bands
    const bassFilter = this.audioContext.createBiquadFilter();
    const midFilter = this.audioContext.createBiquadFilter();
    const trebleFilter = this.audioContext.createBiquadFilter();

    // Configure filters
    bassFilter.type = "lowshelf";
    bassFilter.frequency.value = 200;
    bassFilter.gain.value = bass;

    midFilter.type = "peaking";
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;
    midFilter.gain.value = mid;

    trebleFilter.type = "highshelf";
    trebleFilter.frequency.value = 3000;
    trebleFilter.gain.value = treble;

    // Reconnect the nodes
    this.biquadFilter.disconnect();
    this.biquadFilter.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(this.gainNode);

    return this;
  }

  // Apply a delay effect
  applyDelay(delayTime = 0.5, feedback = 0.5, mix = 0.5) {
    const delayNode = this.audioContext.createDelay();
    const feedbackGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();

    // Set delay parameters
    delayNode.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    dryGain.gain.value = 1 - mix;
    wetGain.gain.value = mix;

    // Connect the delay and feedback loop
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);

    // Reconnect the main signal flow
    const lastNode = this.gainNode;
    lastNode.disconnect();

    // Create dry/wet mix
    lastNode.connect(dryGain);
    lastNode.connect(delayNode);
    delayNode.connect(wetGain);

    // Mix dry and wet signals
    dryGain.connect(this.convolver);
    wetGain.connect(this.convolver);

    return this;
  }

  // Apply distortion effect
  applyDistortion(amount = 20) {
    const distortion = this.audioContext.createWaveShaper();

    // Create the distortion curve using a typed array
    function makeDistortionCurve(amount) {
      const samples = 44100;
      const curve = new Float32Array(samples);
      const deg = Math.PI / 180;

      for (let i = 0; i < samples; ++i) {
        const x = (i * 2) / samples - 1;
        // Various distortion algorithms - this one creates a warm overdrive
        curve[i] =
          ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
      }

      return curve;
    }

    // Apply the distortion curve
    distortion.curve = makeDistortionCurve(amount);
    distortion.oversample = "4x";

    // Insert the distortion node
    const lastNode = this.biquadFilter;
    lastNode.disconnect();
    lastNode.connect(distortion);
    distortion.connect(this.gainNode);

    return this;
  }

  // Custom time-domain effect using direct buffer manipulation
  async applyCustomEffect(audioBuffer, effectType = "reverse") {
    // Create a new buffer to hold the processed audio
    const processedBuffer = this.audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Process each channel
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      // Get raw audio data as Float32Array typed arrays
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = processedBuffer.getChannelData(channel);

      switch (effectType) {
        case "reverse":
          // Reverse the audio by copying samples in reverse order
          for (let i = 0; i < inputData.length; i++) {
            outputData[i] = inputData[inputData.length - 1 - i];
          }
          break;

        case "bitcrush":
          // Reduce bit depth for a lo-fi effect
          const bitDepth = 4; // Bits to keep (out of 32)
          const step = Math.pow(2, 32 - bitDepth);

          for (let i = 0; i < inputData.length; i++) {
            // Quantize the sample to fewer bits
            outputData[i] = Math.floor(inputData[i] * step) / step;
          }
          break;

        case "tremolo":
          // Apply amplitude modulation (tremolo)
          const tremFreq = 5; // Hz
          const tremDepth = 0.5; // 0-1

          for (let i = 0; i < inputData.length; i++) {
            // Calculate modulator (sine wave)
            const time = i / audioBuffer.sampleRate;
            const modulator =
              1 -
              tremDepth * (0.5 + 0.5 * Math.sin(2 * Math.PI * tremFreq * time));
            outputData[i] = inputData[i] * modulator;
          }
          break;

        default:
          // Pass through unchanged
          outputData.set(inputData);
      }
    }

    return processedBuffer;
  }

  // Analyze audio and get frequency data
  getFrequencyData() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Get waveform data
  getTimeData() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }
}

// Example usage
async function processAudioFile(audioFileUrl) {
  try {
    // Create audio context and processor
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const processor = new AudioEffectsProcessor(audioContext);

    // Load audio file
    const response = await fetch(audioFileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Example: Apply custom effect
    const processedBuffer = await processor.applyCustomEffect(
      audioBuffer,
      "tremolo"
    );

    // Create a buffer source for playback
    const source = audioContext.createBufferSource();
    source.buffer = processedBuffer;

    // Connect to the processor chain and add effects
    processor
      .connectSource(source)
      .applyEQ(3, 0, 2)
      .applyDistortion(5)
      .applyDelay(0.3, 0.4, 0.3);

    // Generate reverb and play
    await processor.createReverb(2.0);
    source.start(0);

    return processor; // Return for visualization or further processing
  } catch (error) {
    console.error("Error processing audio:", error);
  }
}
