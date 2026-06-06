# LeetCode AI Assistant Chrome Extension

An AI-powered Chrome Extension for LeetCode that provides real-time code complexity analysis, optimization suggestions, and community-based company tag insights.

## Features

- Real-time Code Analysis**: Captures code from LeetCode Monaco editor
- Complexity Calculation**: Automatic Time and Space complexity detection
- Company Tags**: Shows which companies asked this problem
- AI Integration**: Gemini AI for optimization suggestions
- Pattern Detection**: Identify coding patterns and DSA techniques
- Dark Mode UI**: Seamless integration with LeetCode's dark theme

## Project Structure

```
leetcode-ai-extension/
├── manifest.json          # Chrome extension manifest
├── package.json           # Project dependencies
├── vite.config.js         # Vite build configuration
├── public/                # Static assets
├── src/
│   ├── background/        # Service worker
│   ├── content/           # Content scripts
│   ├── popup/             # Extension popup UI
│   ├── parser/            # Code parsing & analysis
│   ├── ai/                # AI integration
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── data/              # Static data files
└── server/                # Backend Express server
```

## Installation

### Prerequisites
- Node.js 
- npm or yarn
- Chrome browser

### Setup

1. Clone the repository:
```bash
cd LeetcodeExtension
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

4. (Optional) Start the backend server:
```bash
npm run server
```

## Development

### Start development mode:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
```

## Features Roadmap

### Phase 1 
-  Extension scaffolding
-  Code extraction from Monaco
-  Basic UI injection

### Phase 2
-  Complexity engine
-  Company tags
-  Enhanced UI

### Phase 3
-  AI analysis with Gemini
-  Optimization suggestions
-  Pattern detection

### Phase 4
-  Backend database
-  User authentication
-  Sync across devices

## Technologies

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Express.js, MongoDB
- **AI**: Google Gemini API
- **Parsing**: Acorn (JavaScript AST parser)
- **Build**: Vite

## Configuration

### Gemini API Key
Create a `.env` file in the root:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

### Backend API
Default: `http://localhost:5000`

Update in `src/ai/gemini.js` if needed.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Author

AI-Powered LeetCode Extension Project
