"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoiceCommands = void 0;
const react_1 = require("react");
// Get the SpeechRecognition API safely
const getSpeechRecognition = () => {
    return window.SpeechRecognition
        ? new window.SpeechRecognition()
        : window.webkitSpeechRecognition
            ? new window.webkitSpeechRecognition()
            : null;
};
const useVoiceCommands = () => {
    const [commands, setCommands] = (0, react_1.useState)([]);
    const [isListening, setIsListening] = (0, react_1.useState)(false);
    let recognitionInstance = null;
    const registerCommand = (phrase, action) => {
        setCommands((prev) => [...prev, { phrase, action }]);
    };
    const startListening = () => {
        recognitionInstance = getSpeechRecognition();
        if (!recognitionInstance) {
            console.warn("Web Speech API not supported in this browser.");
            return;
        }
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";
        recognitionInstance.onstart = () => setIsListening(true);
        recognitionInstance.onend = () => setIsListening(false);
        recognitionInstance.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript
                .trim()
                .toLowerCase();
            console.log("Heard:", transcript);
            const matchedCommand = commands.find((cmd) => transcript.includes(cmd.phrase));
            if (matchedCommand) {
                matchedCommand.action();
                speakResponse(`Executing command: ${matchedCommand.phrase}`);
            }
        };
        recognitionInstance.start();
    };
    const stopListening = () => {
        recognitionInstance === null || recognitionInstance === void 0 ? void 0 : recognitionInstance.stop();
    };
    const speakResponse = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };
    (0, react_1.useEffect)(() => {
        return () => {
            stopListening();
        };
    }, [commands]);
    return { registerCommand, isListening, startListening, stopListening };
};
exports.useVoiceCommands = useVoiceCommands;
