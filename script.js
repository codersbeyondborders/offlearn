import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

// App Configuration
const APP_MODES = {
  tutor: {
    name: "AI Tutor",
    icon: "🧑‍🏫",
    systemPrompt: "You are an expert tutor who uses the Socratic method and active learning techniques. Always break complex concepts into digestible steps, ask thought-provoking questions, use real-world examples, encourage critical thinking, and be patient and encouraging."
  },
  summarizer: {
    name: "Text Summarizer", 
    icon: "📄",
    systemPrompt: "You are an expert text summarizer. Create clear, concise summaries that capture the main points and key insights. Adapt your summary style based on user preferences for length and format."
  },
  writer: {
    name: "Writing Helper",
    icon: "✍️", 
    systemPrompt: "You are a professional writing assistant. Help improve grammar, style, clarity, and structure. Provide constructive feedback and suggestions while maintaining the author's voice and intent."
  }
};

const LEARNING_SUBJECTS = {
  general: "General Learning",
  math: "Mathematics", 
  science: "Science",
  language: "Language Arts",
  history: "History",
  programming: "Programming",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology"
};

const LEARNING_MODES = {
  tutor: { name: "Tutor", icon: "🧑‍🏫" },
  quiz: { name: "Quiz Master", icon: "📝" },
  practice: { name: "Practice Coach", icon: "💪" },
  review: { name: "Study Guide", icon: "📚" },
  flashcard: { name: "Flashcard Maker", icon: "🗂️" }
};

(async () => {
  // Global state
  let currentMode = 'main';
  let session = null;
  let learningState = {
    subject: 'general',
    level: 'beginner', 
    mode: 'tutor',
    questionCount: 0,
    conversationHistory: []
  };

  // DOM Elements - Main Screen
  const mainScreen = document.getElementById("main-screen");
  const openTutorBtn = document.getElementById("open-tutor");
  const openSummarizerBtn = document.getElementById("open-summarizer");
  const openWriterBtn = document.getElementById("open-writer");

  // DOM Elements - Panels
  const tutorPanel = document.getElementById("tutor-panel");
  const summarizerPanel = document.getElementById("summarizer-panel");
  const writerPanel = document.getElementById("writer-panel");

  // DOM Elements - Navigation
  const backFromTutor = document.getElementById("back-from-tutor");
  const backFromSummarizer = document.getElementById("back-from-summarizer");
  const backFromWriter = document.getElementById("back-from-writer");

  // DOM Elements - Help Buttons
  const tutorHelp = document.getElementById("tutor-help");
  const summarizerHelp = document.getElementById("summarizer-help");
  const writerHelp = document.getElementById("writer-help");

  // DOM Elements - Welcome Modals
  const tutorWelcomeModal = document.getElementById("tutor-welcome-modal");
  const summarizerWelcomeModal = document.getElementById("summarizer-welcome-modal");
  const writerWelcomeModal = document.getElementById("writer-welcome-modal");

  // DOM Elements - Forms
  const tutorForm = document.getElementById("tutor-form");
  const summarizerForm = document.getElementById("summarizer-form");
  const writerForm = document.getElementById("writer-form");

  // DOM Elements - Inputs
  const promptInput = document.getElementById("prompt-input");
  const textInput = document.getElementById("text-input");
  const writingInput = document.getElementById("writing-input");

  // DOM Elements - Output Areas
  const responseArea = document.getElementById("response-area");
  const summaryArea = document.getElementById("summary-area");
  const writingArea = document.getElementById("writing-area");

  // DOM Elements - Sections
  const conversationSection = document.getElementById("conversation-section");
  const summarySection = document.getElementById("summary-section");
  const writingSection = document.getElementById("writing-section");

  // Check AI availability
  if (!('LanguageModel' in self)) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `
      <h3>🚫 AI Not Available</h3>
      <p>Your browser doesn't support the Prompt API. To use this app:</p>
      <ol>
        <li>Use Chrome Dev/Canary (128+)</li>
        <li>Join the <a href="https://goo.gle/chrome-ai-dev-preview-join">Early Preview Program</a></li>
        <li>Enable and download the on-device AI model in Chrome Settings</li>
      </ol>
    `;
    return;
  }

  // Navigation Functions
  const showPanel = (panelName) => {
    // Hide all panels and main screen
    mainScreen.style.display = "none";
    tutorPanel.style.display = "none";
    summarizerPanel.style.display = "none";
    writerPanel.style.display = "none";

    // Show selected panel
    switch(panelName) {
      case 'tutor':
        tutorPanel.style.display = "block";
        currentMode = 'tutor';
        break;
      case 'summarizer':
        summarizerPanel.style.display = "block";
        currentMode = 'summarizer';
        break;
      case 'writer':
        writerPanel.style.display = "block";
        currentMode = 'writer';
        break;
      default:
        mainScreen.style.display = "block";
        currentMode = 'main';
    }
  };

  const showMainScreen = () => {
    showPanel('main');
  };

  // Welcome Modal Functions
  const showWelcomeModal = (modalType) => {
    let modal;
    switch(modalType) {
      case 'tutor':
        modal = tutorWelcomeModal;
        break;
      case 'summarizer':
        modal = summarizerWelcomeModal;
        break;
      case 'writer':
        modal = writerWelcomeModal;
        break;
    }
    
    if (modal) {
      modal.classList.add('show');
      modal.style.display = "flex";
    }
  };

  const hideWelcomeModal = (modalType) => {
    let modal;
    switch(modalType) {
      case 'tutor':
        modal = tutorWelcomeModal;
        break;
      case 'summarizer':
        modal = summarizerWelcomeModal;
        break;
      case 'writer':
        modal = writerWelcomeModal;
        break;
    }
    
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = "none";
    }
  };

  // AI Session Management
  const createSession = async (mode) => {
    if (session) {
      session.destroy();
    }

    try {
      session = await LanguageModel.create({
        temperature: 0.7,
        topK: 8,
        initialPrompts: [{
          role: 'system',
          content: APP_MODES[mode].systemPrompt
        }]
      });
      
      const offlineStatus = document.getElementById("offline-status");
      if (offlineStatus) {
        offlineStatus.textContent = "🟢 Offline Ready";
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      const offlineStatus = document.getElementById("offline-status");
      if (offlineStatus) {
        offlineStatus.textContent = "🔴 Session Error";
      }
    }
  };

  // Tutor Functions
  const handleTutorSubmit = async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    if (!session) {
      await createSession('tutor');
    }

    // Show conversation section
    conversationSection.style.display = "block";
    responseArea.style.display = "block";

    // Create question bubble
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("message", "student-message");
    questionDiv.innerHTML = `
      <div class="message-header">
        <span class="message-role">👤 You</span>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="message-content">${DOMPurify.sanitize(marked.parse(prompt))}</div>
    `;
    responseArea.append(questionDiv);

    // Create response bubble
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("message", "tutor-message");
    responseDiv.innerHTML = `
      <div class="message-header">
        <span class="message-role">🧑‍🏫 AI Tutor</span>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="message-content">Thinking...</div>
    `;
    responseArea.append(responseDiv);

    const contentDiv = responseDiv.querySelector('.message-content');

    try {
      const stream = await session.promptStreaming(prompt);
      let result = '';
      let previousChunk = '';
      
      for await (const chunk of stream) {
        const newChunk = chunk.startsWith(previousChunk) 
          ? chunk.slice(previousChunk.length) : chunk;
        result += newChunk;
        contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(result));
        previousChunk = chunk;
      }

      learningState.questionCount++;
      promptInput.value = "";
      
    } catch (error) {
      contentDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }

    responseArea.scrollTop = responseArea.scrollHeight;
  };

  // Summarizer Functions
  const handleSummarizerSubmit = async (e) => {
    e.preventDefault();
    const text = textInput.value.trim();
    if (!text) return;

    if (!session) {
      await createSession('summarizer');
    }

    const summaryLength = document.getElementById("summary-length").value;
    const summaryStyle = document.getElementById("summary-style").value;

    let prompt = `Please summarize the following text. `;
    
    switch(summaryLength) {
      case 'brief':
        prompt += `Keep it very brief (2-3 sentences). `;
        break;
      case 'medium':
        prompt += `Provide a medium-length summary (1 paragraph). `;
        break;
      case 'detailed':
        prompt += `Provide a detailed summary with multiple paragraphs. `;
        break;
    }

    switch(summaryStyle) {
      case 'bullet':
        prompt += `Format as bullet points. `;
        break;
      case 'outline':
        prompt += `Format as an outline with main points and sub-points. `;
        break;
      default:
        prompt += `Format as clear paragraphs. `;
    }

    prompt += `\n\nText to summarize:\n${text}`;

    // Show summary section
    summarySection.style.display = "block";
    summaryArea.innerHTML = "Generating summary...";

    try {
      const stream = await session.promptStreaming(prompt);
      let result = '';
      let previousChunk = '';
      
      for await (const chunk of stream) {
        const newChunk = chunk.startsWith(previousChunk) 
          ? chunk.slice(previousChunk.length) : chunk;
        result += newChunk;
        summaryArea.innerHTML = DOMPurify.sanitize(marked.parse(result));
        previousChunk = chunk;
      }
      
    } catch (error) {
      summaryArea.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }
  };

  // Writing Helper Functions
  const handleWriterSubmit = async (e) => {
    e.preventDefault();
    const text = writingInput.value.trim();
    if (!text) return;

    if (!session) {
      await createSession('writer');
    }

    const writingTask = document.getElementById("writing-task").value;
    const writingType = document.getElementById("writing-type").value;

    let prompt = ``;
    
    switch(writingTask) {
      case 'improve':
        prompt = `Please improve the following text for clarity, flow, and engagement: `;
        break;
      case 'grammar':
        prompt = `Please check and correct any grammar, spelling, or punctuation errors in the following text: `;
        break;
      case 'style':
        prompt = `Please enhance the style and tone of the following text to make it more engaging: `;
        break;
      case 'ideas':
        prompt = `Please help generate ideas and expand on the following writing prompt or topic: `;
        break;
      case 'structure':
        prompt = `Please help organize and structure the following text for better flow and clarity: `;
        break;
    }

    prompt += `Consider this is ${writingType} writing. `;
    prompt += `\n\nText:\n${text}`;

    // Show writing section
    writingSection.style.display = "block";
    writingArea.innerHTML = "Analyzing your writing...";

    try {
      const stream = await session.promptStreaming(prompt);
      let result = '';
      let previousChunk = '';
      
      for await (const chunk of stream) {
        const newChunk = chunk.startsWith(previousChunk) 
          ? chunk.slice(previousChunk.length) : chunk;
        result += newChunk;
        writingArea.innerHTML = DOMPurify.sanitize(marked.parse(result));
        previousChunk = chunk;
      }
      
    } catch (error) {
      writingArea.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }
  };

  // Event Listeners - Main Navigation
  openTutorBtn?.addEventListener("click", () => {
    showPanel('tutor');
    showWelcomeModal('tutor');
  });

  openSummarizerBtn?.addEventListener("click", () => {
    showPanel('summarizer');
    showWelcomeModal('summarizer');
  });

  openWriterBtn?.addEventListener("click", () => {
    showPanel('writer');
    showWelcomeModal('writer');
  });

  // Event Listeners - Back Buttons
  backFromTutor?.addEventListener("click", showMainScreen);
  backFromSummarizer?.addEventListener("click", showMainScreen);
  backFromWriter?.addEventListener("click", showMainScreen);

  // Event Listeners - Help Buttons
  tutorHelp?.addEventListener("click", () => showWelcomeModal('tutor'));
  summarizerHelp?.addEventListener("click", () => showWelcomeModal('summarizer'));
  writerHelp?.addEventListener("click", () => showWelcomeModal('writer'));

  // Event Listeners - Forms
  tutorForm?.addEventListener("submit", handleTutorSubmit);
  summarizerForm?.addEventListener("submit", handleSummarizerSubmit);
  writerForm?.addEventListener("submit", handleWriterSubmit);

  // Event Listeners - Welcome Modals
  document.getElementById("tutor-welcome-close")?.addEventListener("click", () => hideWelcomeModal('tutor'));
  document.getElementById("tutor-welcome-start")?.addEventListener("click", () => hideWelcomeModal('tutor'));

  document.getElementById("summarizer-welcome-close")?.addEventListener("click", () => hideWelcomeModal('summarizer'));
  document.getElementById("summarizer-welcome-start")?.addEventListener("click", () => hideWelcomeModal('summarizer'));

  document.getElementById("writer-welcome-close")?.addEventListener("click", () => hideWelcomeModal('writer'));
  document.getElementById("writer-welcome-start")?.addEventListener("click", () => hideWelcomeModal('writer'));

  // Event Listeners - Copy Buttons
  document.getElementById("copy-summary-button")?.addEventListener("click", () => {
    const text = summaryArea.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copy-summary-button");
      const originalText = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  });

  document.getElementById("copy-writing-button")?.addEventListener("click", () => {
    const text = writingArea.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copy-writing-button");
      const originalText = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  });

  // Event Listeners - New Buttons
  document.getElementById("new-summary-button")?.addEventListener("click", () => {
    textInput.value = "";
    summarySection.style.display = "none";
    textInput.focus();
  });

  document.getElementById("new-writing-button")?.addEventListener("click", () => {
    writingInput.value = "";
    writingSection.style.display = "none";
    writingInput.focus();
  });

  document.getElementById("new-lesson-button")?.addEventListener("click", () => {
    promptInput.value = "";
    responseArea.innerHTML = "";
    conversationSection.style.display = "none";
    learningState.questionCount = 0;
    promptInput.focus();
  });

  // Event Listeners - Modal Outside Click
  [tutorWelcomeModal, summarizerWelcomeModal, writerWelcomeModal].forEach(modal => {
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove('show');
        modal.style.display = "none";
      }
    });
  });

  // Event Listeners - Escape Key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      [tutorWelcomeModal, summarizerWelcomeModal, writerWelcomeModal].forEach(modal => {
        if (modal && modal.style.display === "flex") {
          modal.classList.remove('show');
          modal.style.display = "none";
        }
      });
    }
  });

  // Initialize
  showMainScreen();
  
  // Focus on first input when panels are shown
  promptInput?.addEventListener("focus", () => promptInput.select());
  textInput?.addEventListener("focus", () => textInput.select());
  writingInput?.addEventListener("focus", () => writingInput.select());

})();