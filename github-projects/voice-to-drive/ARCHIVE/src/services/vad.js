import { MicVAD } from '@ricky0123/vad-web';

export class VADService {
  constructor() {
    this.vad = null;
    this.isInitialized = false;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;
  }

  async initialize(callbacks) {
    console.log('✅ Initializing VAD (Voice Activity Detection)...');
    this.onSpeechStart = callbacks.onSpeechStart;
    this.onSpeechEnd = callbacks.onSpeechEnd;

    this.vad = await MicVAD.new({
      onSpeechStart: () => {
        console.log('🎤 Speech detected - starting recording');
        this.onSpeechStart?.();
      },
      onSpeechEnd: () => {
        console.log('🛑 Speech ended - stopping recording');
        this.onSpeechEnd?.();
      },
      positiveSpeechThreshold: 0.8,  // Tunable for car noise
      minSpeechFrames: 3,
      redemptionFrames: 8,  // How long to wait before considering silence
      // Specify paths for WASM/ONNX files
      modelURL: window.location.origin + '/silero_vad_v5.onnx',
      workletURL: window.location.origin + '/vad.worklet.bundle.min.js',
      ortConfig: (ort) => {
        // Configure ONNX Runtime to find WASM files in root
        ort.env.wasm.wasmPaths = window.location.origin + '/';
      }
    });

    this.isInitialized = true;
    console.log('✅ VAD initialized successfully');
  }

  start() {
    if (this.vad) {
      this.vad.start();
    }
  }

  pause() {
    if (this.vad) {
      this.vad.pause();
    }
  }

  destroy() {
    if (this.vad) {
      this.vad.destroy();
      this.vad = null;
      this.isInitialized = false;
    }
  }
}
