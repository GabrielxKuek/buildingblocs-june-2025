// dependencies
import { useState, useRef, useEffect } from "react";

// components
import Spinner from "@/components/system/Spinner";

const SpeechToEmojiView = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [emojiResult, setEmojiResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setFinalTranscript("");
      setEmojiResult("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript);
      if (finalTranscript) {
        setFinalTranscript((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleEditText = () => {
    setIsEditing(true);
    setEditableText(finalTranscript + transcript);
  };

  const handleSaveEdit = () => {
    setFinalTranscript(editableText);
    setTranscript("");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableText("");
  };

  const handleGenerateEmojis = async () => {
    const textToConvert = finalTranscript + transcript;
    if (!textToConvert.trim()) {
      alert("Please speak or enter some text first");
      return;
    }

    setIsProcessing(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/speech-to-emoji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToConvert }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert to emojis");
      }

      const result = await response.json();
      setEmojiResult(result.emoji_text);
    } catch (error) {
      console.error("Error converting to emojis:", error);
      alert("Failed to convert to emojis. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setTranscript("");
    setFinalTranscript("");
    setEmojiResult("");
    setIsEditing(false);
    setEditableText("");
  };

  const displayText = finalTranscript + transcript;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Speech to Emoji Converter</h2>
        <p className="text-muted-foreground">
          Speak clearly and convert your words to emojis
        </p>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? (
            <>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              Stop Recording
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              Start Recording
            </>
          )}
        </button>

        <button
          onClick={handleClear}
          disabled={!displayText && !emojiResult}
          className="px-6 py-3 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      {/* Live Transcript Display */}
      {(isListening || displayText) && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isListening ? "Live Transcript" : "Transcript"}
            </h3>
            {displayText && !isListening && (
              <button
                onClick={handleEditText}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Edit Text
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Edit your text here..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-lg leading-relaxed">
              {displayText ? (
                <>
                  <span className="text-gray-800">{finalTranscript}</span>
                  {transcript && (
                    <span className="text-gray-500 italic">{transcript}</span>
                  )}
                </>
              ) : (
                <span className="text-gray-400 italic">
                  {isListening ? "Listening... Start speaking" : "No text yet"}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      {displayText && !isListening && !isEditing && (
        <div className="text-center mb-8">
          <button
            onClick={handleGenerateEmojis}
            disabled={isProcessing}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                Generating Emojis...
              </div>
            ) : (
              "Generate Emojis ✨"
            )}
          </button>
        </div>
      )}

      {/* Emoji Result Display */}
      {emojiResult && (
        <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Your Emoji Message
          </h3>
          <div className="text-4xl md:text-5xl leading-relaxed p-4 bg-white rounded-lg shadow-inner">
            {emojiResult}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Original: "{displayText}"
          </p>
        </div>
      )}

      {/* Status Indicator */}
      {isListening && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Recording...
        </div>
      )}
    </div>
  );
};

export default SpeechToEmojiView;
