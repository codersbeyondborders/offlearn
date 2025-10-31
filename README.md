# 📚 OffLearn - Offline Learning Hub

Your personal AI-powered learning companion that works completely offline! Built with Chrome's Gemini Nano, this comprehensive learning platform provides three specialized AI assistants for education, productivity, and writing assistance.

## ✨ Features

### 🎯 Three AI-Powered Modes

#### 🧑‍🏫 **AI Tutor**
- **Subject-Specific Learning**: Mathematics, Science, Language Arts, History, Programming, Physics, Chemistry, Biology
- **Adaptive Difficulty**: Beginner, Intermediate, and Advanced levels
- **Focus Areas**: Optional specialized topics (e.g., algebra, grammar, photosynthesis)
- **Interactive Chat**: Modern chat interface with enhanced question and response bubbles
- **Contextual Responses**: AI adapts to your subject, level, and focus area

#### 📄 **Text Summarizer**
- **Smart Summarization**: Transform long articles, documents, and research papers into key insights
- **Flexible Length**: Brief (2-3 sentences), Medium (1 paragraph), or Detailed (multiple paragraphs)
- **Multiple Formats**: Bullet points, paragraphs, or structured outlines
- **Instant Processing**: Real-time text analysis and summarization
- **Copy & Export**: Easy sharing and note-taking

#### ✍️ **Writing Helper**
- **Grammar & Style**: Professional writing assistance and error correction
- **Content Enhancement**: Improve clarity, flow, and engagement
- **Idea Generation**: Overcome writer's block with creative suggestions
- **Structure Optimization**: Better organization and logical flow
- **Multi-Format Support**: Academic papers, business emails, creative writing, technical docs

### 📱 Progressive Web App (PWA)
- **Install as Native App**: One-click installation on desktop and mobile
- **Offline Functionality**: Complete app functionality without internet
- **Auto-Updates**: Seamless updates with user notification
- **Cross-Platform**: Works on Windows, Mac, Linux, iOS, and Android
- **Desktop Integration**: App shortcuts and system notifications

### 💾 Advanced Offline Features
- **Service Worker**: Intelligent caching and offline support
- **Local Storage**: All conversations and settings preserved
- **Background Sync**: Updates when connection is restored
- **Privacy-First**: Zero data transmission - everything stays on your device
- **Performance Optimized**: Fast loading and smooth interactions

## 🚀 Quick Start

### Requirements
- **Chrome 128+** (Dev/Canary recommended)
- **Built-in AI features** enabled
- **Gemini Nano model** downloaded
- **Secure context** (HTTPS or localhost)

### 🌐 Online Version (Recommended)
**Live Demo**: [Deploy to Google Cloud Run](#-deployment) for instant access

### 💻 Local Development
1. **Install Chrome Dev/Canary**
2. **Join Early Preview**: Visit https://goo.gle/chrome-ai-dev-preview-join
3. **Update Chrome**: Settings → About Chrome → Update
4. **Download AI Model**: Settings → System → On-device AI → Download
5. **Run the App**:
   ```bash
   # Clone or download the repository
   git clone <repository-url>
   cd learning-hub
   
   # Option 1: Python server (recommended)
   python3 -m http.server 8080
   
   # Option 2: Node.js server
   npx serve . -p 8080
   
   # Option 3: PHP server
   php -S localhost:8080
   ```
6. **Visit**: http://localhost:8080

### 📱 Install as PWA
1. **Open the app** in Chrome/Edge
2. **Click "📱 Install App"** in the header
3. **Confirm installation** in the dialog
4. **Use like a native app** - works completely offline!

## 🎓 How to Use

### 🧑‍🏫 AI Tutor Mode
1. **Select Subject**: Choose from Math, Science, Programming, etc.
2. **Set Difficulty**: Pick Beginner, Intermediate, or Advanced
3. **Add Focus Area**: Optional specific topic (e.g., "quadratic equations")
4. **Start Chatting**: Ask questions and get personalized explanations
5. **Adjust Settings**: Use Advanced Options for response length and creativity

### 📄 Summarizer Mode
1. **Paste Your Text**: Add articles, documents, or research papers
2. **Choose Length**: Brief, Medium, or Detailed summary
3. **Select Format**: Bullet points, paragraphs, or outline
4. **Get Summary**: Instant intelligent summarization
5. **Copy Results**: Easy export for notes and sharing

### ✍️ Writing Helper Mode
1. **Select Task**: Grammar check, style improvement, idea generation, etc.
2. **Choose Text Type**: Academic, business, creative, or technical
3. **Input Your Text**: Paste existing content or describe your writing needs
4. **Get Assistance**: Receive professional writing improvements
5. **Apply Changes**: Copy enhanced text for your projects

## 🎯 Use Cases

### 👨‍🎓 For Students
- **Homework Help**: Get instant explanations and step-by-step guidance
- **Exam Preparation**: Practice with AI tutor in any subject
- **Writing Assistance**: Improve essays, reports, and creative writing
- **Research Support**: Quickly summarize academic papers and articles
- **Self-Paced Learning**: Learn at your own speed, anytime, anywhere

### 👩‍🏫 For Educators
- **Supplemental Tutoring**: 24/7 AI assistant for students
- **Content Creation**: Summarize materials and improve lesson plans
- **Writing Feedback**: Help students enhance their writing skills
- **Remote Learning**: Perfect for areas with limited internet connectivity
- **Accessibility**: Offline learning for all students

### 💼 For Professionals
- **Document Summarization**: Quickly digest long reports and articles
- **Writing Enhancement**: Professional communication and content creation
- **Learning & Development**: Continuous skill improvement
- **Research Assistance**: Efficient information processing
- **Productivity**: Streamline writing and content tasks

## � DPeployment

### 🌐 Google Cloud Run (Recommended)
Deploy your own instance with one command:

```bash
# Prerequisites: Install Google Cloud CLI and authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Deploy using the included script
chmod +x deploy.sh
./deploy.sh YOUR_PROJECT_ID

# Or deploy manually
gcloud run deploy learning-hub \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

**Result**: Get a public HTTPS URL like `https://learning-hub-xyz-uc.a.run.app`

### 🐳 Docker Deployment
```bash
# Build the container
docker build -t learning-hub .

# Run locally
docker run -p 8080:8080 learning-hub

# Or deploy to any container platform
```

### 📁 Static Hosting
Deploy to any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable in repository settings
- **Firebase Hosting**: `firebase deploy`

## 🛡️ Privacy & Security

- **🔒 100% Local Processing**: All AI inference happens on your device
- **🚫 Zero Data Transmission**: No network calls for AI operations
- **💾 Local Storage Only**: Conversations stored in browser localStorage
- **🎛️ Full Data Control**: Easy to clear data with "New Lesson" button
- **📤 Export Freedom**: Download your data anytime
- **🔐 HTTPS Enforced**: Secure connections for PWA functionality
- **🛡️ Content Security Policy**: Protection against XSS attacks

## 🔧 Troubleshooting

### 🚫 "AI Not Available" Error
- **Browser**: Use Chrome Dev/Canary 128+ or Edge Dev
- **Early Preview**: Join at https://goo.gle/chrome-ai-dev-preview-join
- **AI Model**: Download in Chrome Settings → System → On-device AI
- **Secure Context**: Ensure HTTPS or localhost connection
- **Flags**: Enable `chrome://flags/#optimization-guide-on-device-model`

### 📱 PWA Installation Issues
- **Install Button Missing**: Wait 30 seconds, refresh page, check HTTPS
- **Service Worker Errors**: Check DevTools → Application → Service Workers
- **Manifest Issues**: Verify manifest.json loads without errors
- **Cache Problems**: Try incognito mode or hard refresh (Ctrl+Shift+R)

### ⚡ Performance Issues
- **Memory**: Click "New Lesson" to reset session and free memory
- **Tokens**: Monitor token usage in status bar
- **Browser**: Restart Chrome if AI becomes unresponsive
- **Storage**: Clear browser data if localStorage is full

### 🌐 Deployment Issues
- **Cloud Run**: Check logs with `gcloud run services logs tail learning-hub`
- **Build Failures**: Verify Dockerfile syntax and file permissions
- **HTTPS**: Ensure SSL certificate is properly configured
- **Service Worker**: Check that sw.js is accessible at root path

## 📚 Documentation

- **[INSTALL.md](INSTALL.md)**: Complete PWA installation guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Detailed deployment instructions
- **[generate-icons.html](generate-icons.html)**: PWA icon generator tool

## 🏗️ Technical Architecture

### 🧠 AI & Core
- **Chrome's Prompt API** (Gemini Nano) for local AI inference
- **Streaming Responses** for real-time AI interaction
- **Context-Aware Prompting** with subject, level, and focus area integration
- **Session Management** with temperature and creativity controls

### 🎨 Frontend
- **Vanilla JavaScript** (ES6+) - No framework dependencies
- **Modern CSS** with CSS Grid, Flexbox, and custom properties
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Automatic theme detection
- **Progressive Enhancement** - Works without JavaScript for basic functionality

### 📱 PWA Features
- **Service Worker** (sw.js) for offline functionality and caching
- **Web App Manifest** (manifest.json) for native app installation
- **Background Sync** for updates when connection is restored
- **Push Notifications** ready (for future features)
- **App Shortcuts** for quick access to different modes

### 🗄️ Data & Storage
- **Local Storage** for conversations and user preferences
- **IndexedDB** ready for future large data storage
- **No External APIs** - Complete privacy and offline functionality
- **Export/Import** capabilities for data portability

### 🚀 Deployment
- **Docker** containerization with Nginx
- **Google Cloud Run** optimized configuration
- **Static Hosting** compatible (Netlify, Vercel, GitHub Pages)
- **CDN Ready** with proper caching headers

### 🔒 Security
- **Content Security Policy** (CSP) headers
- **HTTPS Enforcement** for PWA requirements
- **XSS Protection** with DOMPurify sanitization
- **No External Dependencies** loaded from CDN (security by isolation)

## 🎯 Browser Compatibility

### ✅ Fully Supported
- **Chrome 128+** (Dev/Canary) - Full AI features
- **Edge 128+** (Dev/Canary) - Full AI features

### ⚠️ Partial Support
- **Chrome Stable** - UI works, AI features pending
- **Edge Stable** - UI works, AI features pending
- **Safari** - PWA installation only, no AI features
- **Firefox** - Basic functionality, limited PWA support

### 📱 Mobile Support
- **Android Chrome** - Full PWA and AI support (when available)
- **iOS Safari** - PWA installation, no AI features
- **Samsung Internet** - PWA support, AI features pending

## 🔮 Future Enhancements

### 🎓 Educational Features
- **Flashcard Generation** - AI-powered study cards
- **Learning Analytics** - Progress tracking and insights
- **Multi-language Support** - International accessibility
- **Voice Interaction** - Speech-to-text and text-to-speech
- **Collaborative Learning** - Shared sessions and peer learning

### 🛠️ Technical Improvements
- **Offline Sync** - Multi-device synchronization
- **Plugin System** - Extensible architecture
- **Advanced Caching** - Intelligent content prefetching
- **Performance Monitoring** - Real-time analytics
- **A/B Testing** - Feature experimentation framework

## 📄 License

**Apache-2.0 License** - Open source and free to use

Based on Chrome Web AI demos: https://github.com/GoogleChromeLabs/web-ai-demos

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- **Bug Reports** - Help us improve the app
- **Feature Requests** - Suggest new functionality
- **Code Contributions** - Submit pull requests
- **Documentation** - Improve guides and tutorials
- **Testing** - Help test on different devices and browsers

## 🌟 Acknowledgments

- **Google Chrome Team** - For the amazing on-device AI capabilities
- **Chrome AI Early Preview** - For making local AI accessible
- **Open Source Community** - For tools and inspiration

---

**🎓 Empowering education through accessible, offline-first AI technology! 🌍**

**⭐ Star this repository if you find it useful!**
