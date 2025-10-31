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


const LEVEL_PROMPTS = {
  beginner: "Adapt your teaching for beginners by using simple, clear language without jargon, providing basic examples from everyday life, explaining fundamental concepts step-by-step, being extra patient and encouraging, and checking understanding frequently.",
  intermediate: "Adapt your teaching for intermediate learners by using appropriate technical vocabulary with explanations, providing balanced depth with practical applications, making connections to previously learned concepts, and encouraging independent thinking and problem-solving.",
  advanced: "Adapt your teaching for advanced learners by using sophisticated language and technical depth, providing comprehensive explanations with nuanced details, making connections to broader concepts and theories, and encouraging critical analysis and evaluation."
};

const SUBJECT_CONTEXTS = {
  general: "Focus on clear explanations and practical applications across various topics.",
  math: "Focus on mathematical reasoning, problem-solving strategies, and real-world applications. Use step-by-step solutions and visual representations when possible.",
  science: "Emphasize scientific method, evidence-based reasoning, and connections to everyday phenomena. Use experiments and observations to illustrate concepts.",
  language: "Focus on communication skills, critical reading, creative expression, and cultural understanding. Use diverse examples from literature and media.",
  history: "Emphasize cause-and-effect relationships, multiple perspectives, and connections to current events. Use primary sources and storytelling techniques.",
  programming: "Focus on problem-solving logic, best practices, and practical applications. Provide code examples and debugging strategies.",
  physics: "Emphasize mathematical modeling, experimental design, and real-world applications. Use analogies and thought experiments.",
  chemistry: "Focus on molecular interactions, chemical reasoning, and laboratory applications. Use visual models and everyday examples.",
  biology: "Emphasize systems thinking, evolution, and connections to health and environment. Use case studies and current research."
};

(async () => {
  // Global state
  let currentMode = 'main';
  let session = null;
  let summarizer = null;
  let writer = null;
  let rewriter = null;
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
  const backtoHome = document.getElementById("back-to-home");
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

  // DOM Elements - Summarizer Controls
  const summaryType = document.getElementById("summary-type");
  const summaryLength = document.getElementById("summary-length");
  const summaryFormat = document.getElementById("summary-format");
  const sharedContext = document.getElementById("shared-context");
  const summarizerStatus = document.getElementById("summarizer-status");
  const summarizerProgress = document.getElementById("summarizer-progress");
  const summarizerProgressText = document.getElementById("summarizer-progress-text");

  // DOM Elements - Writer Controls
  const writingMode = document.getElementById("writing-mode");
  const writingTone = document.getElementById("writing-tone");
  const writingLength = document.getElementById("writing-length");
  const writingFormat = document.getElementById("writing-format");
  const writingContext = document.getElementById("writing-context");
  const writerStatus = document.getElementById("writer-status");
  const writerProgress = document.getElementById("writer-progress");
  const writerProgressText = document.getElementById("writer-progress-text");
  const writingFormHeading = document.getElementById("writing-form-heading");

  // DOM Elements - Output Areas
  const responseArea = document.getElementById("response-area");
  const summaryArea = document.getElementById("summary-area");
  const writingArea = document.getElementById("writing-area");

  // DOM Elements - Sections
  const conversationSection = document.getElementById("conversation-section");
  const summarySection = document.getElementById("summary-section");
  const writingSection = document.getElementById("writing-section");

  // DOM Elements - Learning Setup
  const subjectSelect = document.getElementById("subject-select");
  const levelSelect = document.getElementById("level-select");
  const focusArea = document.getElementById("focus-area");

  // Check AI availability
  const checkAIAvailability = () => {
    const hasPromptAPI = 'LanguageModel' in self;
    const hasSummarizerAPI = 'Summarizer' in self;
    const hasWriterAPI = 'Writer' in self;
    const hasRewriterAPI = 'Rewriter' in self;
    
    if (!hasPromptAPI && !hasSummarizerAPI && !hasWriterAPI && !hasRewriterAPI) {
      const errorMessage = document.getElementById("error-message");
      errorMessage.style.display = "block";
      errorMessage.innerHTML = `
        <h3>🚫 AI Not Available</h3>
        <p>Your browser doesn't support the AI APIs. To use this app:</p>
        <ol>
          <li>Use Chrome Dev/Canary (128+)</li>
          <li>Join the <a href="https://goo.gle/chrome-ai-dev-preview-join">Early Preview Program</a></li>
          <li>Enable and download the on-device AI model in Chrome Settings</li>
        </ol>
      `;
      return false;
    }
    
    return { hasPromptAPI, hasSummarizerAPI, hasWriterAPI, hasRewriterAPI };
  };

  const aiAvailability = checkAIAvailability();
  if (!aiAvailability) return;

  // Navigation Functions
  const showPanel = (panelName) => {
    // Hide all panels and main screen
    mainScreen.style.display = "none";
    tutorPanel.style.display = "none";
    summarizerPanel.style.display = "none";
    writerPanel.style.display = "none";

    // Hide any status indicators
    summarizerStatus.style.display = "none";
    writerStatus.style.display = "none";

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
        updateWritingModeUI(); // Update UI when entering writer panel
        break;
      default:
        mainScreen.style.display = "block";
        currentMode = 'main';
    }
  };

  const showMainScreen = () => {
    showPanel('main');
  };

  // Loading State Management
  const setButtonLoading = (button, isLoading) => {
    if (!button) return;
    
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.innerHTML = '<span class="spinner"></span> Processing...';
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  };

  // Get Learning Context
  const getLearningContext = () => {
    const subject = subjectSelect?.value || 'general';
    const level = levelSelect?.value || 'beginner';
    const focus = focusArea?.value?.trim() || '';

    return { subject, level, focus };
  };

  // Generate Enhanced System Prompt for Tutor
  const generateTutorSystemPrompt = () => {
    const { subject, level, focus } = getLearningContext();
    
    let systemPrompt = "You are an expert AI tutor. Provide direct, clear, and concise explanations without unnecessary introductions or filler text. Get straight to the point and focus on delivering valuable educational content.";
    
    systemPrompt += '\n\n' + LEVEL_PROMPTS[level];
    
    if (subject !== 'general' && SUBJECT_CONTEXTS[subject]) {
      systemPrompt += '\n\nSubject Context: ' + SUBJECT_CONTEXTS[subject];
    }
    
    if (focus) {
      systemPrompt += `\n\nSpecial Focus: Pay particular attention to "${focus}" in your responses.`;
    }
    
    systemPrompt += '\n\nIMPORTANT: Be direct and concise. Skip introductory phrases like "Great question!" or "I\'d be happy to help." Start directly with the educational content. Use clear formatting and provide actionable information.';
    
    return systemPrompt;
  };

  // Generate Enhanced User Prompt for Tutor
  const generateTutorUserPrompt = (userInput) => {
    const { subject, level, focus } = getLearningContext();
    
    let contextualPrompt = `Subject: ${LEARNING_SUBJECTS[subject]}, Level: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
    
    if (focus) {
      contextualPrompt += `, Focus Area: ${focus}`;
    }
    
    // Get response length preference
    const responseLength = document.getElementById("response-length")?.value || 'concise';
    const lengthInstructions = {
      concise: "Keep your response concise and direct (1-2 paragraphs max). No introductory phrases.",
      detailed: "Provide a detailed explanation with examples. Be direct and skip pleasantries.",
      comprehensive: "Give a comprehensive explanation with multiple examples and connections. Start directly with the content."
    };
    
    contextualPrompt += `\n\nResponse Style: ${lengthInstructions[responseLength]}`;
    contextualPrompt += `\n\nQuestion: ${userInput}`;
    
    return contextualPrompt;
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
      // Get temperature from slider
      const temperature = document.getElementById("session-temperature")?.value || 0.7;
      
      let systemPrompt;
      if (mode === 'tutor') {
        systemPrompt = generateTutorSystemPrompt();
      } else {
        systemPrompt = APP_MODES[mode].systemPrompt;
      }

      session = await LanguageModel.create({
        temperature: Number(temperature),
        topK: 8,
        initialPrompts: [{
          role: 'system',
          content: systemPrompt
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

  // Summarizer Management
  const createSummarizer = async () => {
    if (!aiAvailability.hasSummarizerAPI) {
      throw new Error("Summarizer API not available");
    }

    // Check availability first
    const availability = await Summarizer.availability();
    if (availability === 'unavailable') {
      throw new Error("Summarizer is not available on this device");
    }

    // Show progress if downloading
    if (availability === 'downloadable') {
      summarizerStatus.style.display = "block";
      summarizerStatus.querySelector('.status-message').textContent = "Downloading Summarizer model...";
    }

    // Check for user activation
    if (!navigator.userActivation.isActive) {
      throw new Error("User activation required to create summarizer");
    }

    try {
      const options = {
        type: summaryType?.value || 'key-points',
        format: summaryFormat?.value || 'markdown',
        length: summaryLength?.value || 'medium',
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round(e.loaded * 100);
            summarizerProgress.style.width = `${progress}%`;
            summarizerProgressText.textContent = `${progress}%`;
            console.log(`Summarizer downloaded ${progress}%`);
          });
        }
      };

      // Add shared context if provided
      const contextValue = sharedContext?.value?.trim();
      if (contextValue) {
        options.sharedContext = contextValue;
      }

      summarizer = await Summarizer.create(options);
      
      // Hide progress indicator
      summarizerStatus.style.display = "none";
      
      const offlineStatus = document.getElementById("offline-status");
      if (offlineStatus) {
        offlineStatus.textContent = "🟢 Offline Ready";
      }
    } catch (error) {
      summarizerStatus.style.display = "none";
      throw error;
    }
  };

  // Writer Management
  const createWriter = async () => {
    if (!aiAvailability.hasWriterAPI) {
      throw new Error("Writer API not available");
    }

    // Check availability first
    const availability = await Writer.availability();
    if (availability === 'unavailable') {
      throw new Error("Writer is not available on this device");
    }

    // Show progress if downloading
    if (availability === 'downloadable') {
      writerStatus.style.display = "block";
      writerStatus.querySelector('.status-message').textContent = "Downloading Writer model...";
    }

    // Check for user activation
    if (!navigator.userActivation.isActive) {
      throw new Error("User activation required to create writer");
    }

    try {
      const options = {
        tone: getWriterTone(),
        format: writingFormat?.value || 'markdown',
        length: getWriterLength(),
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round(e.loaded * 100);
            writerProgress.style.width = `${progress}%`;
            writerProgressText.textContent = `${progress}%`;
            console.log(`Writer downloaded ${progress}%`);
          });
        }
      };

      // Add shared context if provided
      const contextValue = writingContext?.value?.trim();
      if (contextValue) {
        options.sharedContext = contextValue;
      }

      writer = await Writer.create(options);
      
      // Hide progress indicator
      writerStatus.style.display = "none";
      
      const offlineStatus = document.getElementById("offline-status");
      if (offlineStatus) {
        offlineStatus.textContent = "🟢 Offline Ready";
      }
    } catch (error) {
      writerStatus.style.display = "none";
      throw error;
    }
  };

  // Rewriter Management
  const createRewriter = async () => {
    if (!aiAvailability.hasRewriterAPI) {
      throw new Error("Rewriter API not available");
    }

    // Check availability first
    const availability = await Rewriter.availability();
    if (availability === 'unavailable') {
      throw new Error("Rewriter is not available on this device");
    }

    // Show progress if downloading
    if (availability === 'downloadable') {
      writerStatus.style.display = "block";
      writerStatus.querySelector('.status-message').textContent = "Downloading Rewriter model...";
    }

    // Check for user activation
    if (!navigator.userActivation.isActive) {
      throw new Error("User activation required to create rewriter");
    }

    try {
      const options = {
        tone: getRewriterTone(),
        format: writingFormat?.value || 'as-is',
        length: getRewriterLength(),
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round(e.loaded * 100);
            writerProgress.style.width = `${progress}%`;
            writerProgressText.textContent = `${progress}%`;
            console.log(`Rewriter downloaded ${progress}%`);
          });
        }
      };

      // Add shared context if provided
      const contextValue = writingContext?.value?.trim();
      if (contextValue) {
        options.sharedContext = contextValue;
      }

      rewriter = await Rewriter.create(options);
      
      // Hide progress indicator
      writerStatus.style.display = "none";
      
      const offlineStatus = document.getElementById("offline-status");
      if (offlineStatus) {
        offlineStatus.textContent = "🟢 Offline Ready";
      }
    } catch (error) {
      writerStatus.style.display = "none";
      throw error;
    }
  };

  // Helper functions for Writer/Rewriter options
  const getWriterTone = () => {
    const tone = writingTone?.value || 'neutral';
    // Map to Writer API values
    if (tone === 'more-formal' || tone === 'more-casual' || tone === 'as-is') {
      return 'neutral'; // Writer API doesn't support these, use neutral
    }
    return tone;
  };

  const getRewriterTone = () => {
    const tone = writingTone?.value || 'as-is';
    // Map to Rewriter API values
    if (tone === 'formal') return 'more-formal';
    if (tone === 'casual') return 'more-casual';
    return tone;
  };

  const getWriterLength = () => {
    const length = writingLength?.value || 'short';
    // Map to Writer API values
    if (length === 'as-is' || length === 'shorter' || length === 'longer') {
      return 'short'; // Writer API doesn't support these, use short
    }
    return length;
  };

  const getRewriterLength = () => {
    const length = writingLength?.value || 'as-is';
    // Map to Rewriter API values
    if (length === 'short') return 'shorter';
    if (length === 'medium') return 'as-is';
    if (length === 'long') return 'longer';
    return length;
  };

  // Update UI based on writing mode
  const updateWritingModeUI = () => {
    const mode = writingMode?.value || 'write';
    
    // Update form heading and placeholder
    if (writingFormHeading && writingInput) {
      switch(mode) {
        case 'write':
          writingFormHeading.textContent = "Describe what you want to write";
          writingInput.placeholder = "e.g., 'Write an email to my team about the project update'";
          break;
        case 'rewrite':
          writingFormHeading.textContent = "Paste text to rewrite and improve";
          writingInput.placeholder = "Paste your existing text here to rewrite and improve it...";
          break;
        case 'proofread':
          writingFormHeading.textContent = "Paste text to proofread and fix";
          writingInput.placeholder = "Paste your text here to check for grammar, spelling, and style errors...";
          break;
      }
    }

    // Update tone options based on mode
    if (writingTone) {
      const currentValue = writingTone.value;
      writingTone.innerHTML = '';
      
      if (mode === 'write') {
        // Writer API tone options
        writingTone.innerHTML = `
          <option value="neutral" ${currentValue === 'neutral' ? 'selected' : ''}>Neutral</option>
          <option value="formal" ${currentValue === 'formal' ? 'selected' : ''}>Formal</option>
          <option value="casual" ${currentValue === 'casual' ? 'selected' : ''}>Casual</option>
        `;
      } else if (mode === 'rewrite') {
        // Rewriter API tone options
        writingTone.innerHTML = `
          <option value="as-is" ${currentValue === 'as-is' ? 'selected' : ''}>As-Is</option>
          <option value="more-formal" ${currentValue === 'more-formal' ? 'selected' : ''}>More Formal</option>
          <option value="more-casual" ${currentValue === 'more-casual' ? 'selected' : ''}>More Casual</option>
        `;
      } else {
        // Proofreading mode - tone doesn't apply
        writingTone.innerHTML = `
          <option value="as-is" selected>Preserve Original</option>
        `;
      }
    }

    // Update length options based on mode
    if (writingLength) {
      const currentValue = writingLength.value;
      writingLength.innerHTML = '';
      
      if (mode === 'write') {
        // Writer API length options
        writingLength.innerHTML = `
          <option value="short" ${currentValue === 'short' ? 'selected' : ''}>Short</option>
          <option value="medium" ${currentValue === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="long" ${currentValue === 'long' ? 'selected' : ''}>Long</option>
        `;
      } else if (mode === 'rewrite') {
        // Rewriter API length options
        writingLength.innerHTML = `
          <option value="as-is" ${currentValue === 'as-is' ? 'selected' : ''}>As-Is</option>
          <option value="shorter" ${currentValue === 'shorter' ? 'selected' : ''}>Shorter</option>
          <option value="longer" ${currentValue === 'longer' ? 'selected' : ''}>Longer</option>
        `;
      } else {
        // Proofreading mode - length doesn't apply
        writingLength.innerHTML = `
          <option value="as-is" selected>Preserve Length</option>
        `;
      }
    }

    // Update format options based on mode
    if (writingFormat) {
      const currentValue = writingFormat.value;
      writingFormat.innerHTML = '';
      
      if (mode === 'write') {
        // Writer API format options
        writingFormat.innerHTML = `
          <option value="markdown" ${currentValue === 'markdown' ? 'selected' : ''}>Markdown</option>
          <option value="plain-text" ${currentValue === 'plain-text' ? 'selected' : ''}>Plain Text</option>
        `;
      } else if (mode === 'rewrite') {
        // Rewriter API format options
        writingFormat.innerHTML = `
          <option value="as-is" ${currentValue === 'as-is' ? 'selected' : ''}>As-Is</option>
          <option value="markdown" ${currentValue === 'markdown' ? 'selected' : ''}>Markdown</option>
          <option value="plain-text" ${currentValue === 'plain-text' ? 'selected' : ''}>Plain Text</option>
        `;
      } else {
        // Proofreading mode - preserve format
        writingFormat.innerHTML = `
          <option value="as-is" selected>Preserve Format</option>
        `;
      }
    }

    // Reset writer/rewriter instances when mode changes
    writer = null;
    rewriter = null;
  };

  // Tutor Functions
  const handleTutorSubmit = async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    const submitButton = document.getElementById("submit-button");
    
    // Set loading state
    setButtonLoading(submitButton, true);

    try {
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

      // Generate enhanced prompt with learning context
      const enhancedPrompt = generateTutorUserPrompt(prompt);
      
      const stream = await session.promptStreaming(enhancedPrompt);
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
      const errorDiv = responseArea.querySelector('.message:last-child .message-content');
      if (errorDiv) {
        errorDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
      }
    } finally {
      // Remove loading state
      setButtonLoading(submitButton, false);
      responseArea.scrollTop = responseArea.scrollHeight;
    }
  };

  // Summarizer Functions
  const handleSummarizerSubmit = async (e) => {
    e.preventDefault();
    const text = textInput.value.trim();
    if (!text) return;

    const submitButton = document.getElementById("summarize-button");
    
    // Set loading state
    setButtonLoading(submitButton, true);

    try {
      // Create or recreate summarizer with current settings
      await createSummarizer();

      // Show summary section
      summarySection.style.display = "block";
      summaryArea.innerHTML = "Generating summary...";

      // Prepare context if provided
      const contextOptions = {};
      const contextValue = sharedContext?.value?.trim();
      if (contextValue) {
        contextOptions.context = contextValue;
      }

      // Use streaming summarization
      const stream = summarizer.summarizeStreaming(text, contextOptions);
      let result = '';
      
      for await (const chunk of stream) {
        result = chunk; // Summarizer API returns complete chunks, not incremental
        
        // Format based on selected format
        if (summaryFormat?.value === 'markdown') {
          summaryArea.innerHTML = DOMPurify.sanitize(marked.parse(result));
        } else {
          summaryArea.innerHTML = DOMPurify.sanitize(result.replace(/\n/g, '<br>'));
        }
      }
      
    } catch (error) {
      console.error("Summarizer error:", error);
      summaryArea.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
      
      // Show helpful error messages
      if (error.message.includes('not available')) {
        summaryArea.innerHTML += `<p>The Summarizer API is not available. Please ensure you're using Chrome Dev/Canary with AI features enabled.</p>`;
      } else if (error.message.includes('User activation')) {
        summaryArea.innerHTML += `<p>Please click the button again to activate the summarizer.</p>`;
      }
    } finally {
      // Remove loading state
      setButtonLoading(submitButton, false);
    }
  };

  // Writing Helper Functions
  const handleWriterSubmit = async (e) => {
    e.preventDefault();
    const text = writingInput.value.trim();
    if (!text) return;

    const submitButton = document.getElementById("writing-button");
    const mode = writingMode?.value || 'write';
    
    // Set loading state
    setButtonLoading(submitButton, true);

    try {
      // Show writing section
      writingSection.style.display = "block";
      writingArea.innerHTML = "Processing your request...";

      let result = '';
      
      if (mode === 'write') {
        // Use Writer API for new content generation
        await createWriter();
        
        // Prepare context if provided
        const contextOptions = {};
        const contextValue = writingContext?.value?.trim();
        if (contextValue) {
          contextOptions.context = contextValue;
        }

        // Use streaming writing
        const stream = writer.writeStreaming(text, contextOptions);
        
        for await (const chunk of stream) {
          result = chunk; // Writer API returns complete chunks
          
          // Format based on selected format
          if (writingFormat?.value === 'markdown') {
            writingArea.innerHTML = DOMPurify.sanitize(marked.parse(result));
          } else {
            writingArea.innerHTML = DOMPurify.sanitize(result.replace(/\n/g, '<br>'));
          }
        }
        
      } else if (mode === 'rewrite') {
        // Use Rewriter API for text improvement
        await createRewriter();
        
        // Prepare context if provided
        const contextOptions = {};
        const contextValue = writingContext?.value?.trim();
        if (contextValue) {
          contextOptions.context = contextValue;
        }

        // Use streaming rewriting
        const stream = rewriter.rewriteStreaming(text, contextOptions);
        
        for await (const chunk of stream) {
          result = chunk; // Rewriter API returns complete chunks
          
          // Format based on selected format
          if (writingFormat?.value === 'markdown') {
            writingArea.innerHTML = DOMPurify.sanitize(marked.parse(result));
          } else if (writingFormat?.value === 'plain-text') {
            writingArea.innerHTML = DOMPurify.sanitize(result.replace(/\n/g, '<br>'));
          } else {
            // as-is format
            writingArea.innerHTML = DOMPurify.sanitize(result.replace(/\n/g, '<br>'));
          }
        }
        
      } else if (mode === 'proofread') {
        // Use Prompt API for proofreading (fallback until Proofreader API is available)
        if (!session) {
          await createSession('writer');
        }

        const prompt = `Please proofread and correct any grammar, spelling, punctuation, and style errors in the following text. Maintain the original meaning and tone:\n\n${text}`;
        
        const stream = await session.promptStreaming(prompt);
        let previousChunk = '';
        
        for await (const chunk of stream) {
          const newChunk = chunk.startsWith(previousChunk) 
            ? chunk.slice(previousChunk.length) : chunk;
          result += newChunk;
          writingArea.innerHTML = DOMPurify.sanitize(marked.parse(result));
          previousChunk = chunk;
        }
      }
      
    } catch (error) {
      console.error("Writer error:", error);
      writingArea.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
      
      // Show helpful error messages
      if (error.message.includes('not available')) {
        writingArea.innerHTML += `<p>The ${mode === 'write' ? 'Writer' : 'Rewriter'} API is not available. Please ensure you're using Chrome Dev/Canary with AI features enabled.</p>`;
      } else if (error.message.includes('User activation')) {
        writingArea.innerHTML += `<p>Please click the button again to activate the ${mode === 'write' ? 'writer' : 'rewriter'}.</p>`;
      }
    } finally {
      // Remove loading state
      setButtonLoading(submitButton, false);
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
  backtoHome?.addEventListener("click", showMainScreen);
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

  // Event Listeners - Learning Setup Changes (recreate session with new context)
  subjectSelect?.addEventListener("change", () => {
    if (currentMode === 'tutor' && session) {
      createSession('tutor'); // Recreate session with new subject context
    }
  });

  levelSelect?.addEventListener("change", () => {
    if (currentMode === 'tutor' && session) {
      createSession('tutor'); // Recreate session with new level context
    }
  });

  // Event Listeners - Summarizer Settings Changes (recreate summarizer with new options)
  summaryType?.addEventListener("change", () => {
    if (currentMode === 'summarizer' && summarizer) {
      summarizer = null; // Will be recreated on next use
    }
  });

  summaryLength?.addEventListener("change", () => {
    if (currentMode === 'summarizer' && summarizer) {
      summarizer = null; // Will be recreated on next use
    }
  });

  summaryFormat?.addEventListener("change", () => {
    if (currentMode === 'summarizer' && summarizer) {
      summarizer = null; // Will be recreated on next use
    }
  });

  sharedContext?.addEventListener("input", () => {
    if (currentMode === 'summarizer' && summarizer) {
      summarizer = null; // Will be recreated on next use
    }
  });

  // Event Listeners - Writer Settings Changes
  writingMode?.addEventListener("change", () => {
    updateWritingModeUI();
    writer = null;
    rewriter = null;
  });

  writingTone?.addEventListener("change", () => {
    if (currentMode === 'writer') {
      writer = null;
      rewriter = null;
    }
  });

  writingLength?.addEventListener("change", () => {
    if (currentMode === 'writer') {
      writer = null;
      rewriter = null;
    }
  });

  writingFormat?.addEventListener("change", () => {
    if (currentMode === 'writer') {
      writer = null;
      rewriter = null;
    }
  });

  writingContext?.addEventListener("input", () => {
    if (currentMode === 'writer') {
      writer = null;
      rewriter = null;
    }
  });

  // Event Listeners - Temperature Change
  document.getElementById("session-temperature")?.addEventListener("input", () => {
    if (session) {
      createSession(currentMode); // Recreate session with new temperature
    }
  });

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
    summarizerStatus.style.display = "none";
    summarizer = null; // Reset summarizer for fresh start
    textInput.focus();
  });

  document.getElementById("new-writing-button")?.addEventListener("click", () => {
    writingInput.value = "";
    writingSection.style.display = "none";
    writerStatus.style.display = "none";
    writer = null;
    rewriter = null;
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