# 📚 Offlearn - Offline Learning Hub

Your personal AI-powered learning companion that works completely offline! Built with Chrome's Gemini Nano, this learning hub provides personalized tutoring for students with low connectivity or no internet access.

## ✨ Features

### 🎯 Adaptive Learning
- **Subject Selection**: Mathematics, Science, Language Arts, History, Programming, and General Learning
- **Difficulty Levels**: Beginner, Intermediate, and Advanced content adaptation
- **Learning Modes**: 
  - 🧑‍🏫 **Tutor Mode**: Socratic method with guided explanations
  - 📝 **Quiz Mode**: Interactive practice questions with feedback
  - 🔧 **Practice Mode**: Hands-on exercises and problem solving
  - 📖 **Review Mode**: Summary and reinforcement of key concepts

### 💾 Offline-First Design
- **Complete Offline Functionality**: Works without internet once set up
- **Local Data Storage**: All conversations and progress saved locally
- **Privacy-First**: No data leaves your device
- **Low Bandwidth**: Minimal resource usage for low-connectivity environments

### 🛠️ Learning Tools
- **Progress Tracking**: Monitor questions asked and learning sessions
- **Bookmarking**: Save important conversations for later review
- **Note Export**: Copy entire learning sessions as text notes
- **Session Management**: Start fresh lessons while preserving history
- **Progress Export**: Download learning progress as JSON files

## 🚀 Quick Start

### Requirements
- Chrome 128+ (Dev/Canary recommended)
- Built-in AI features enabled
- Gemini Nano model downloaded
- Secure context (https or localhost)

### Setup Instructions
1. **Install Chrome Dev/Canary**
2. **Join Early Preview**: Visit https://goo.gle/chrome-ai-dev-preview-join
3. **Update Chrome**: Settings → About Chrome → Update
4. **Download AI Model**: Settings → System → On-device AI → Download
5. **Run the App**:
   ```bash
   # Option 1: Direct file access
   open index.html
   
   # Option 2: Local server (recommended)
   python3 -m http.server 8080
   # or
   npx serve .
   ```
6. **Visit**: https://localhost:8080

## 🎓 How to Use

1. **Choose Your Subject**: Select from Math, Science, Language Arts, etc.
2. **Set Your Level**: Pick Beginner, Intermediate, or Advanced
3. **Select Learning Mode**: Choose Tutor, Quiz, Practice, or Review
4. **Start Learning**: Ask questions or request explanations
5. **Track Progress**: Monitor your learning journey
6. **Save Important Content**: Bookmark key conversations
7. **Export Progress**: Download your learning history

## 🔧 For Educators

This tool is perfect for:
- **Remote Learning**: Students with limited internet access
- **Supplemental Tutoring**: 24/7 available AI tutor
- **Self-Paced Learning**: Students can learn at their own speed
- **Homework Help**: Instant explanations and guidance
- **Exam Preparation**: Practice questions and review sessions

## 🛡️ Privacy & Security

- **100% Local Processing**: All AI inference happens on your device
- **No Network Calls**: Zero data transmission for learning sessions
- **Local Storage Only**: Conversations stored in browser localStorage
- **Data Control**: Easy to clear data with "New Lesson" button
- **Export Freedom**: Download your data anytime

## 🔧 Troubleshooting

### "AI Not Available" Error
- Ensure you're using Chrome Dev/Canary 128+
- Join the Early Preview Program
- Check that the AI model is downloaded in Chrome Settings
- Verify you're on a secure context (https/localhost)

### Performance Issues
- Click "New Lesson" to reset the session
- Check available tokens in the status bar
- Restart Chrome if needed
- Ensure sufficient device memory

### Feature Requests
This is a basic implementation. Future enhancements could include:
- Flashcard generation
- Learning analytics dashboard
- Multi-language support
- Voice interaction
- Collaborative learning features

## 🏗️ Technical Details

Built with:
- **Chrome's Prompt API** (Gemini Nano)
- **Vanilla JavaScript** (no frameworks)
- **Local Storage** for persistence
- **Markdown Rendering** for rich content
- **Responsive Design** for all devices

## 📄 License

Apache-2.0 License - Based on Chrome Web AI demos
GitHub: https://github.com/GoogleChromeLabs/web-ai-demos

---

**Perfect for students in areas with limited internet connectivity! 🌍**
