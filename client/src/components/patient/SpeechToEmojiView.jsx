// dependencies
import { useState, useRef, useEffect } from "react";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Volume2, Trash2, Copy, AlertCircle, Keyboard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Spinner from "@/components/system/Spinner";

// api
import { convertTextToEmoji } from "@/services/api/patient";

const SpeechToEmojiView = ({ onSendToCaregiver }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [emojiResult, setEmojiResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [inputMode, setInputMode] = useState('speech'); // 'speech' or 'text'
    
    const recognitionRef = useRef(null);
    const [isSupported, setIsSupported] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Check if we're on HTTPS or localhost
    const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    // Initialize speech recognition
    useEffect(() => {
        if (!isSecureContext) {
            setError('Speech recognition requires HTTPS or localhost. Please use text input instead.');
            setInputMode('text');
            return;
        }

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            
            recognitionRef.current.continuous = false; // Changed to false for better reliability
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.maxAlternatives = 1;
            
            recognitionRef.current.onstart = () => {
                console.log('Speech recognition started');
                setError('');
            };
            
            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPart = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPart;
                    } else {
                        interimTranscript += transcriptPart;
                    }
                }
                
                setTranscript((finalTranscript || interimTranscript).trim());
            };
            
            recognitionRef.current.onend = () => {
                console.log('Speech recognition ended');
                setIsListening(false);
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let errorMessage = '';
                
                switch(event.error) {
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection or try typing instead.';
                        setInputMode('text');
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
                        setPermissionDenied(true);
                        setInputMode('text');
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try speaking clearly or use text input.';
                        break;
                    case 'aborted':
                        errorMessage = 'Speech recognition was cancelled.';
                        break;
                    case 'service-not-allowed':
                        errorMessage = 'Speech service not allowed. Please try using text input.';
                        setInputMode('text');
                        break;
                    default:
                        errorMessage = `Speech recognition error: ${event.error}. Try using text input instead.`;
                        setInputMode('text');
                }
                
                setError(errorMessage);
                setIsListening(false);
            };
            
            setIsSupported(true);
        } else {
            setIsSupported(false);
            setInputMode('text');
            setError('Speech recognition not supported in this browser. Please use text input.');
        }
        
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isSecureContext]);

    const requestMicrophonePermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionDenied(false);
            setError('');
            return true;
        } catch (err) {
            console.error('Microphone permission denied:', err);
            setPermissionDenied(true);
            setError('Microphone access denied. Please allow microphone access and refresh the page.');
            setInputMode('text');
            return false;
        }
    };

    const startListening = async () => {
        if (!isSecureContext) {
            setError('Speech recognition requires HTTPS. Please use text input.');
            return;
        }

        if (recognitionRef.current && !isListening) {
            // Check microphone permission first
            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) return;

            setTranscript('');
            setError('');
            
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error('Failed to start speech recognition:', err);
                setError('Failed to start speech recognition. Please try text input instead.');
                setInputMode('text');
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const convertToEmoji = async () => {
        if (!transcript.trim()) {
            setError('Please speak something or type a message first');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const result = await convertTextToEmoji(transcript);
            setEmojiResult(result.emoji_text);
            
            // Add to history
            const newEntry = {
                id: Date.now(),
                originalText: transcript,
                emojiText: result.emoji_text,
                timestamp: new Date().toLocaleTimeString()
            };
            setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
            
        } catch (error) {
            console.error('Error converting to emoji:', error);
            setError('Failed to convert text to emoji. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setTranscript('');
        setEmojiResult('');
        setError('');
    };

    const handleSpeak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    };

    const sendToCaregiver = () => {
        if (onSendToCaregiver && emojiResult) {
            const messageData = {
                id: `emoji_${Date.now()}`,
                name: "Emoji Message",
                originalText: transcript,
                emojiText: emojiResult,
                type: "emoji",
                timestamp: new Date().toISOString()
            };
            onSendToCaregiver(messageData);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Speech to Emoji 🗣️➡️😊</h1>
                <p className="text-muted-foreground">
                    Speak naturally or type your words and we'll convert them to emojis for easier communication
                </p>
            </div>

            {/* Input Mode Toggle */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            variant={inputMode === 'speech' ? 'default' : 'outline'}
                            onClick={() => setInputMode('speech')}
                            disabled={!isSupported || !isSecureContext || permissionDenied}
                        >
                            <Mic className="h-4 w-4 mr-2" />
                            Speech Input
                        </Button>
                        <Button
                            variant={inputMode === 'text' ? 'default' : 'outline'}
                            onClick={() => setInputMode('text')}
                        >
                            <Keyboard className="h-4 w-4 mr-2" />
                            Text Input
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Conversion Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{inputMode === 'speech' ? 'Voice Input' : 'Text Input'}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAll}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Error Display */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {inputMode === 'speech' ? (
                        /* Voice Control */
                        <div className="text-center">
                            <Button
                                onClick={isListening ? stopListening : startListening}
                                size="lg"
                                className={`h-20 w-20 rounded-full ${
                                    isListening 
                                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                                        : 'bg-primary hover:bg-primary/90'
                                }`}
                                disabled={!isSupported || !isSecureContext || permissionDenied}
                            >
                                {isListening ? (
                                    <MicOff className="h-8 w-8" />
                                ) : (
                                    <Mic className="h-8 w-8" />
                                )}
                            </Button>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {isListening ? 'Listening... Click to stop' : 
                                 !isSupported ? 'Speech not supported' :
                                 !isSecureContext ? 'Requires HTTPS' :
                                 permissionDenied ? 'Microphone access denied' :
                                 'Click to start speaking'}
                            </p>
                        </div>
                    ) : (
                        /* Text Input */
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type your message:</label>
                            <div className="flex gap-2">
                                <Input
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 text-lg p-4"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && transcript.trim()) {
                                            convertToEmoji();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={() => handleSpeak(transcript)}
                                    variant="outline"
                                    disabled={!transcript.trim()}
                                    className="px-4"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Transcript Display */}
                    {transcript && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your message:</label>
                            <div className="p-4 bg-muted rounded-lg min-h-[60px] flex items-center">
                                <p className="text-lg">{transcript}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={convertToEmoji}
                                    disabled={loading || !transcript.trim()}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                            Converting...
                                        </>
                                    ) : (
                                        'Convert to Emoji'
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSpeak(transcript)}
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Emoji Result */}
                    {emojiResult && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Emoji Translation:</label>
                            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-2xl leading-relaxed">{emojiResult}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={sendToCaregiver}
                                    className="flex-1"
                                    disabled={!onSendToCaregiver}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send to Caregiver
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSpeak(transcript)}
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(emojiResult)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* History */}
            {history.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {history.map((entry) => (
                                <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">
                                            {entry.timestamp}
                                        </span>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSpeak(entry.originalText)}
                                            >
                                                <Volume2 className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(entry.emojiText)}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        "{entry.originalText}"
                                    </div>
                                    <div className="text-lg">
                                        {entry.emojiText}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {loading && <Spinner message="Converting to emoji..." />}
        </div>
    );
};

export default SpeechToEmojiView;