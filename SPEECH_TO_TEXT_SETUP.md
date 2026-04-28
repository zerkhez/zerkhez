# Speech-to-Text Setup Guide

## Overview
Speech-to-text functionality has been integrated into the Kisan Dost chatbot. Users can now tap the microphone button to speak instead of typing. The app automatically recognizes the language (English or Urdu) based on the current language setting.

## Installation

### 1. Install Dependencies
From the `frontend/` directory:
```bash
npm install
```

This will install `expo-speech-recognition` which provides native speech recognition via Expo.

### 2. Platform-Specific Setup

#### Android
The app uses Android's built-in speech recognition (Google Speech). Ensure your device has:
- Google Play Services installed
- Microphone permissions enabled in app settings

#### iOS
The app uses iOS native SpeechRecognition framework. For EAS builds:
```bash
eas build --platform ios
```

iOS requires microphone permission in `app.json` (automatically handled by Expo).

### 3. Verify Installation
Start the app:
```bash
npx expo start
```

## Features

### Language-Aware Recognition
- **English (en)**: Voice input recognized as English
- **Urdu (ur-PK)**: Voice input recognized as Urdu/Hindustani

Switch languages in the app's settings, and the next speech recognition will use the appropriate language.

### User Flow
1. Tap the microphone button (🎤)
2. Button turns red and displays "Listening..."
3. Speak your message
4. Recognition stops automatically after speech ends
5. Recognized text is automatically sent to Kisan Dost
6. Bot responds with relevant information

### Error Handling
- **Microphone Permission Denied**: Alert with permission request message (in app language)
- **No Speech Detected**: Silent failure (user can retry)
- **Network/Other Errors**: Alert with error message

### UI Feedback
- **Microphone Button**: Turns red (#E74C3C) when listening
- **Listening Indicator**: "Listening..." text appears below input bar
- **Automatic Send**: Recognized text is automatically sent to Kisan Dost

## Troubleshooting

### Microphone Permission Issues
- **Android**: Grant microphone permission in app settings
- **iOS**: Ensure app has microphone permission in Settings > [App Name] > Microphone

### Recognition Not Working
1. Check internet connection (voice recognition uses device-native APIs)
2. Speak clearly in the selected language
3. Ensure microphone is not muted
4. Try restarting the app

### Language Not Recognized
Ensure the language is properly set in the app before using voice input. The language setting in the app determines which language the voice recognizer will use.

## Code Changes

### Files Modified
- `frontend/package.json`: Added expo-speech-recognition dependency
- `frontend/app/chat.tsx`: Added speech recognition logic and UI
- `frontend/locales/en.json`: Added English speech UI strings
- `frontend/locales/ur.json`: Added Urdu speech UI strings

### New State/Functions
- `isListening`: State to track microphone recording
- `handleMicPress()`: Async function to start/stop voice recognition
- Uses `SpeechRecognition.start()` and `SpeechRecognition.stop()` from expo package
- Automatically sends recognized text to chatbot via `sendMessage()`

## API Details

### Speech Recognition Locales
- English: `en-US`
- Urdu: `ur-PK` (Pakistan variant for Urdu)
- Other supported locales: English variants (en-GB, en-AU), Hindustani, etc.

### ExpoWebSpeechRecognition API
```typescript
// Create instance
const recognition = new ExpoWebSpeechRecognition();

// Configure
recognition.lang = 'en-US';          // Set language
recognition.continuous = false;       // Single phrase
recognition.interimResults = false;    // Final results only
recognition.maxAlternatives = 1;       // Get top result only

// Start listening
recognition.start();

// Stop listening
recognition.stop();

// Event handlers
recognition.onstart = () => { /* listening started */ };
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Process transcript
};
recognition.onerror = (event) => { /* handle error */ };
recognition.onend = () => { /* listening ended */ };
```

## Future Enhancements
- [ ] Add waveform visualization during recording
- [ ] Add recording timer
- [ ] Add voice command shortcuts (e.g., "Show weather" triggers quick reply)
- [ ] Add offline speech recognition option
- [ ] Support for additional languages (Punjabi, Sindhi, etc.)
