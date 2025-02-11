import { useState, useEffect } from "react";

// Get the SpeechRecognition API safely
const getSpeechRecognition = (): SpeechRecognition | null => {
  return window.SpeechRecognition
    ? new window.SpeechRecognition()
    : window.webkitSpeechRecognition
    ? new window.webkitSpeechRecognition()
    : null;
};

interface Command {
  phrase: string;
  action: () => void;
}

const useVoiceCommands = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  let recognitionInstance: SpeechRecognition | null = null;

  const registerCommand = (phrase: string, action: () => void): void => {
    setCommands((prev: Command[]) => [...prev, { phrase, action }]);
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

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      console.log("Heard:", transcript);

      const matchedCommand = commands.find((cmd:any) => transcript.includes(cmd.phrase));
      if (matchedCommand) {
        matchedCommand.action();
        speakResponse(`Executing command: ${matchedCommand.phrase}`);
      }
    };

    recognitionInstance.start();
  };

  const stopListening = () => {
    recognitionInstance?.stop();
  };

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [commands]);

  return { registerCommand, isListening, startListening, stopListening };
};

export { useVoiceCommands };
