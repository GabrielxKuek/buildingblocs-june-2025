// src/services/deepgram.js - New Deepgram service for speech-to-text

class DeepgramService {
    constructor() {
        this.apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
        this.baseUrl = 'https://api.deepgram.com/v1/listen';
        
        if (!this.apiKey) {
            console.warn('Deepgram API key not found. Falling back to browser speech recognition.');
        }
    }

    async transcribeAudio(audioBlob) {
        if (!this.apiKey) {
            throw new Error('Deepgram API key not configured');
        }

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.wav');

            const response = await fetch(`${this.baseUrl}?model=general&smart_format=true&language=en`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.apiKey}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Deepgram API error: ${response.status}`);
            }

            const result = await response.json();
            
            // Extract transcript from Deepgram response
            if (result.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
                return result.results.channels[0].alternatives[0].transcript;
            } else {
                throw new Error('No transcript found in Deepgram response');
            }
        } catch (error) {
            console.error('Deepgram transcription error:', error);
            throw error;
        }
    }

    async transcribeStream(stream, onTranscript, onError) {
        if (!this.apiKey) {
            throw new Error('Deepgram API key not configured');
        }

        try {
            const websocketUrl = `wss://api.deepgram.com/v1/listen?model=general&smart_format=true&language=en&encoding=linear16&sample_rate=16000`;
            
            const ws = new WebSocket(websocketUrl, ['token', this.apiKey]);
            
            ws.onopen = () => {
                console.log('Deepgram WebSocket connected');
            };
            
            ws.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.channel?.alternatives?.[0]?.transcript) {
                    const transcript = response.channel.alternatives[0].transcript;
                    if (transcript.trim()) {
                        onTranscript(transcript, response.is_final);
                    }
                }
            };
            
            ws.onerror = (error) => {
                console.error('Deepgram WebSocket error:', error);
                onError(error);
            };
            
            ws.onclose = () => {
                console.log('Deepgram WebSocket closed');
            };

            // Set up audio recording and streaming
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                    ws.send(event.data);
                }
            };
            
            mediaRecorder.start(250); // Send data every 250ms
            
            return {
                stop: () => {
                    mediaRecorder.stop();
                    ws.close();
                }
            };
        } catch (error) {
            console.error('Deepgram streaming error:', error);
            throw error;
        }
    }
}

export default new DeepgramService();