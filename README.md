# React Voice UI

React Voice UI is a lightweight hook-based library that enables voice commands in React applications.

## Installation
```sh
npm install react-voice-ui
```

## Usage
```tsx
import { useVoiceCommands } from "react-voice-ui";

const App = () => {
  const { registerCommand } = useVoiceCommands();

  registerCommand("open menu", () => console.log("Opening menu"));

  return <div>Try saying "Open Menu"</div>;
};
```

## Features
- Register custom voice commands
- Start and stop voice recognition
- Text-to-Speech feedback

## License
MIT License
