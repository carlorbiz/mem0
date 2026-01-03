/**
 * Cloudflare Worker for Audio Transcription using Whisper AI
 *
 * Endpoints:
 *   POST /transcribe - Transcribe audio blob to text
 *
 * Model: @cf/openai/whisper-large-v3-turbo
 */

export default {
  async fetch(request, env) {
    // CORS headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      // Parse the URL to get the endpoint
      const url = new URL(request.url);

      // Route to transcription endpoint
      if (url.pathname === '/transcribe' || url.pathname === '/') {
        return await handleTranscribe(request, env, corsHeaders);
      }

      // Unknown endpoint
      return new Response(
        JSON.stringify({ error: 'Not found. Use POST /transcribe' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};

/**
 * Handle transcription requests
 */
async function handleTranscribe(request, env, corsHeaders) {
  try {
    // Get audio data from request
    const contentType = request.headers.get('Content-Type') || '';

    let audioBlob;

    // Support different content types
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      audioBlob = formData.get('audio');

      if (!audioBlob) {
        return new Response(
          JSON.stringify({ error: 'No audio file found in form data' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      // Assume raw audio blob
      audioBlob = await request.blob();
    }

    // Validate audio blob
    if (!audioBlob || audioBlob.size === 0) {
      return new Response(
        JSON.stringify({ error: 'No audio data received' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check blob size (Whisper has limits, typically ~25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioBlob.size > maxSize) {
      return new Response(
        JSON.stringify({
          error: 'Audio file too large',
          maxSize: maxSize,
          receivedSize: audioBlob.size,
        }),
        {
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Transcribing audio: ${audioBlob.size} bytes, type: ${audioBlob.type}`);

    // Initialize Cloudflare AI
    const ai = new Ai(env.AI);

    // Convert blob to array buffer, then to array of numbers
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioArray = [...new Uint8Array(arrayBuffer)];

    // Run Whisper transcription
    const startTime = Date.now();
    const response = await ai.run('@cf/openai/whisper-large-v3-turbo', {
      audio: audioArray,
    });
    const processingTime = Date.now() - startTime;

    console.log(`Transcription completed in ${processingTime}ms:`, response.text?.substring(0, 100));

    // Return transcript
    return new Response(
      JSON.stringify({
        success: true,
        text: response.text || '',
        timestamp: new Date().toISOString(),
        processingTime: processingTime,
        audioSize: audioBlob.size,
        vtt: response.vtt || null, // Some Whisper models return VTT format
        words: response.words || null, // Word-level timestamps if available
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Transcription error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Transcription failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
