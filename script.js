import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

// Enhanced Learning Hub Configuration
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
  tutor: {
    name: "Tutor",
    icon: "🧑‍🏫",
    prompt: "You are an expert tutor who uses the Socratic method and active learning techniques. Always:\n- Break complex concepts into digestible steps\n- Ask thought-provoking questions to guide discovery\n- Use real-world examples and analogies\n- Encourage critical thinking\n- Provide multiple perspectives on topics\n- Check for understanding before moving forward\n- Be patient and encouraging"
  },
  quiz: {
    name: "Quiz Master",
    icon: "📝",
    prompt: "You are an engaging quiz master who creates effective assessments. Always:\n- Generate questions that test understanding, not just memorization\n- Provide immediate, constructive feedback\n- Explain why answers are correct or incorrect\n- Offer hints for difficult questions\n- Create varied question types (multiple choice, short answer, problem-solving)\n- Adapt difficulty based on student responses\n- Celebrate correct answers and encourage learning from mistakes"
  },
  practice: {
    name: "Practice Coach",
    icon: "💪",
    prompt: "You are a supportive practice coach focused on skill development. Always:\n- Provide hands-on exercises and real problems to solve\n- Give step-by-step guidance when students are stuck\n- Offer multiple practice problems of increasing difficulty\n- Provide detailed solutions with explanations\n- Suggest practice strategies and study techniques\n- Track progress and celebrate improvements\n- Connect practice to real-world applications"
  },
  review: {
    name: "Study Guide",
    icon: "📚",
    prompt: "You are a comprehensive study guide creator who helps consolidate learning. Always:\n- Summarize key concepts in organized, memorable ways\n- Create visual learning aids (when possible with text)\n- Highlight the most important points to remember\n- Show connections between different concepts\n- Provide memory techniques and mnemonics\n- Create review schedules and study plans\n- Test retention with quick recall questions"
  },
  flashcard: {
    name: "Flashcard Maker",
    icon: "🗂️",
    prompt: "You are a flashcard creation expert who makes effective study cards. Always:\n- Create concise, focused question-answer pairs\n- Use active recall principles\n- Include visual descriptions when helpful\n- Make cards that test understanding, not just facts\n- Provide context and explanations\n- Create cards for different difficulty levels\n- Suggest spaced repetition schedules"
  }
};

const LEVEL_PROMPTS = {
  beginner: "Adapt your teaching for beginners by:\n- Using simple, clear language without jargon\n- Providing basic examples from everyday life\n- Explaining fundamental concepts step-by-step\n- Being extra patient and encouraging\n- Checking understanding frequently\n- Building confidence with positive reinforcement",
  intermediate: "Adapt your teaching for intermediate learners by:\n- Using appropriate technical vocabulary with explanations\n- Providing balanced depth with practical applications\n- Making connections to previously learned concepts\n- Introducing more complex examples and scenarios\n- Encouraging independent thinking and problem-solving\n- Challenging students while providing support",
  advanced: "Adapt your teaching for advanced learners by:\n- Using sophisticated language and technical depth\n- Providing comprehensive explanations with nuanced details\n- Making connections to broader concepts and theories\n- Encouraging critical analysis and evaluation\n- Presenting multiple perspectives and approaches\n- Challenging assumptions and promoting original thinking"
};

const SUBJECT_CONTEXTS = {
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
  // DOM Elements
  const errorMessage = document.getElementById("error-message");
  const costSpan = document.getElementById("cost");
  const promptArea = document.getElementById("prompt-area");
  const problematicArea = document.getElementById("problematic-area");
  const promptInput = document.getElementById("prompt-input");
  const responseArea = document.getElementById("response-area");
  const form = document.querySelector("form");
  const sessionTemperature = document.getElementById("session-temperature");

  // Learning Hub Elements
  const subjectSelect = document.getElementById("subject-select");
  const levelSelect = document.getElementById("level-select");
  const modeSelect = document.getElementById("mode-select");
  const focusArea = document.getElementById("focus-area");
  const newLessonButton = document.getElementById("new-lesson-button");
  const copyNotesButton = document.getElementById("copy-notes-button");
  const helpButton = document.getElementById("help-button");
  const offlineStatus = document.getElementById("offline-status");
  const sessionInfo = document.getElementById("session-info");
  const currentSubject = document.getElementById("current-subject");
  const currentLevel = document.getElementById("current-level");
  const currentMode = document.getElementById("current-mode");
  const questionCount = document.getElementById("question-count");
  const studyTime = document.getElementById("study-time");
  const learningStreak = document.getElementById("learning-streak");
  const tempValue = document.getElementById("temp-value");
  const responseLengthSelect = document.getElementById("response-length");
  const conversationSection = document.getElementById("conversation-section");

  // Enhanced Learning State
  let learningState = {
    subject: 'general',
    level: 'beginner',
    mode: 'tutor',
    questionCount: 0,
    conversationHistory: [],
    studyPlan: [],
    learningStreak: 0,
    totalStudyTime: 0,
    sessionStartTime: Date.now(),
    achievements: [],
    weakAreas: [],
    strongAreas: []
  };

  responseArea.style.display = "none";

  let session = null;



  // Load saved learning state
  const loadLearningState = () => {
    const saved = localStorage.getItem('learningHubState');
    if (saved) {
      const savedState = JSON.parse(saved);
      learningState = { ...learningState, ...savedState };

      // Check if it's a new day for streak calculation
      const lastSession = new Date(savedState.lastSessionDate || 0);
      const today = new Date();
      const daysDiff = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        learningState.learningStreak++;
      } else if (daysDiff > 1) {
        learningState.learningStreak = 1;
      }

      learningState.lastSessionDate = today.toISOString();
      learningState.sessionStartTime = Date.now();

      // Restore UI state
      if (savedState.focusArea) {
        focusArea.value = savedState.focusArea;
      }
      if (savedState.responseLength) {
        responseLengthSelect.value = savedState.responseLength;
      }

      updateLearningUI();
    }
  };

  // Save learning state
  const saveLearningState = () => {
    localStorage.setItem('learningHubState', JSON.stringify(learningState));
  };

  // Generate enhanced system prompt based on current learning context
  const generateSystemPrompt = () => {
    const subject = learningState.subject;
    const level = learningState.level;
    const mode = learningState.mode;

    let prompt = `${LEARNING_MODES[mode].prompt}\n\n`;
    prompt += `${LEVEL_PROMPTS[level]}\n\n`;

    if (subject !== 'general' && SUBJECT_CONTEXTS[subject]) {
      prompt += `Subject Focus - ${LEARNING_SUBJECTS[subject]}: ${SUBJECT_CONTEXTS[subject]}\n\n`;
    }

    // Add learning context
    prompt += `Learning Context:\n`;
    prompt += `- Student has asked ${learningState.questionCount} questions this session\n`;
    prompt += `- Current learning streak: ${learningState.learningStreak} days\n`;

    if (learningState.weakAreas.length > 0) {
      prompt += `- Areas needing improvement: ${learningState.weakAreas.join(', ')}\n`;
    }

    if (learningState.strongAreas.length > 0) {
      prompt += `- Strong areas: ${learningState.strongAreas.join(', ')}\n`;
    }

    prompt += `\nAlways:\n`;
    prompt += `- Be encouraging and build confidence\n`;
    prompt += `- Use formatting (headers, lists, emphasis) to make content scannable\n`;
    prompt += `- Provide actionable next steps\n`;
    prompt += `- Connect new concepts to previously discussed topics when relevant\n`;
    prompt += `- If asked about topics outside your expertise, guide to reliable educational resources\n`;
    prompt += `- End responses with a follow-up question to encourage continued learning`;

    return prompt;
  };

  // Update learning UI elements
  const updateLearningUI = () => {
    subjectSelect.value = learningState.subject;
    levelSelect.value = learningState.level;
    modeSelect.value = learningState.mode;
    currentSubject.textContent = LEARNING_SUBJECTS[learningState.subject];
    currentLevel.textContent = learningState.level.charAt(0).toUpperCase() + learningState.level.slice(1);
    currentMode.textContent = LEARNING_MODES[learningState.mode].name;
    questionCount.textContent = learningState.questionCount;

    // Update study time
    const sessionTime = Math.floor((Date.now() - learningState.sessionStartTime) / 60000);
    const totalTime = learningState.totalStudyTime + sessionTime;
    studyTime.textContent = totalTime < 60 ? `${totalTime}m` : `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`;

    // Update learning streak
    learningStreak.textContent = `${learningState.learningStreak} days`;

    // Update button text based on mode
    const submitButton = document.getElementById("submit-button");
    const modeIcon = LEARNING_MODES[learningState.mode].icon;
    submitButton.textContent = `${modeIcon} Ask ${LEARNING_MODES[learningState.mode].name}`;
  };

  if (!('LanguageModel' in self)) {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `
      <h3>🚫 AI Not Available</h3>
      <p>Your browser doesn't support the Prompt API. To use the Offline Learning Hub:</p>
      <ol>
        <li>Use Chrome Dev/Canary (128+)</li>
        <li>Join the <a href="https://goo.gle/chrome-ai-dev-preview-join">Early Preview Program</a></li>
        <li>Enable and download the on-device AI model in Chrome Settings</li>
      </ol>
    `;
    offlineStatus.textContent = "🔴 AI Unavailable";
    return;
  }

  // Ensure prompt area is visible
  console.log('promptArea element:', promptArea);
  if (promptArea) {
    promptArea.style.display = "block";
    console.log('Prompt area should now be visible');
  } else {
    console.error('promptArea element not found!');
  }

  loadLearningState();

  const promptModel = async () => {
    console.log('promptModel called with prompt:', promptInput.value.trim());
    problematicArea.style.display = "none";
    const prompt = promptInput.value.trim();
    if (!prompt) {
      console.log('No prompt provided, returning');
      return;
    }

    // Show loading state on submit button
    const submitButton = document.getElementById("submit-button");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Thinking...";
    submitButton.disabled = true;

    // Show conversation section and response area
    console.log('conversationSection element:', conversationSection);
    console.log('responseArea element:', responseArea);

    if (conversationSection) {
      conversationSection.style.display = "block";
      console.log('Conversation section shown, display:', conversationSection.style.display);

      // Scroll to conversation section immediately
      setTimeout(() => {
        conversationSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } else {
      console.error('conversationSection element not found!');
    }

    responseArea.style.display = "block";
    console.log('Response area shown, display:', responseArea.style.display);

    // Create student question bubble
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

    // Create tutor response bubble
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("message", "tutor-message");
    responseDiv.innerHTML = `
      <div class="message-header">
        <span class="message-role">🤖 ${LEARNING_MODES[learningState.mode].name}</span>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="message-content">Thinking...</div>
    `;
    responseArea.append(responseDiv);

    const contentDiv = responseDiv.querySelector('.message-content');

    try {
      if (!session) {
        await updateSession();
      }

      // Add learning context to the prompt
      let contextualPrompt = `Subject: ${LEARNING_SUBJECTS[learningState.subject]}, Level: ${learningState.level}`;

      if (focusArea.value.trim()) {
        contextualPrompt += `, Focus Area: ${focusArea.value.trim()}`;
      }

      const responseLength = responseLengthSelect.value;
      const lengthInstructions = {
        concise: "Keep your response concise and to the point (2-3 paragraphs max).",
        detailed: "Provide a detailed explanation with examples and context.",
        comprehensive: "Give a comprehensive, thorough explanation with multiple examples, analogies, and connections to other concepts."
      };

      contextualPrompt += `\n\nResponse Style: ${lengthInstructions[responseLength]}\n\nStudent Question: ${prompt}`;

      const stream = await session.promptStreaming(contextualPrompt);

      let result = '';
      let previousChunk = '';
      for await (const chunk of stream) {
        const newChunk = chunk.startsWith(previousChunk)
          ? chunk.slice(previousChunk.length) : chunk;
        result += newChunk;
        contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(result));
        previousChunk = chunk;
      }

      // Update learning state
      learningState.questionCount++;
      learningState.conversationHistory.push({
        question: prompt,
        answer: result,
        timestamp: Date.now(),
        subject: learningState.subject,
        level: learningState.level,
        mode: learningState.mode,
        focusArea: focusArea.value.trim()
      });

      // Analyze learning patterns
      analyzeAndUpdateLearningPatterns(prompt, result);

      updateLearningUI();
      saveLearningState();

      // Clear the input for next question
      promptInput.value = "";
      costSpan.textContent = "";

      // Show learning tip occasionally
      showLearningTip();

    } catch (error) {
      contentDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    } finally {
      // Restore submit button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;

      // Scroll to bottom
      responseArea.scrollTop = responseArea.scrollHeight;
    }
  };

  const updateSessionInfo = () => {
    if (!session) {
      sessionInfo.textContent = "Session: Not Ready";
      return;
    }

    const tokensUsed = session.inputUsage || session.tokensSoFar || 0;
    const totalTokens = session.inputQuota || session.maxTokens || 0;
    const tokensLeft = totalTokens - tokensUsed;

    sessionInfo.textContent = `Session: ${tokensUsed}/${totalTokens} tokens used`;

    // Update status based on token usage
    if (tokensLeft < 100) {
      sessionInfo.style.color = "#ff6b6b";
    } else if (tokensLeft < 500) {
      sessionInfo.style.color = "#ffa726";
    } else {
      sessionInfo.style.color = "#4caf50";
    }
  };

  // Learning Hub Event Listeners
  subjectSelect.addEventListener("change", () => {
    learningState.subject = subjectSelect.value;
    updateLearningUI();
    saveLearningState();
    updateSession(); // Restart session with new context
  });

  levelSelect.addEventListener("change", () => {
    learningState.level = levelSelect.value;
    updateLearningUI();
    saveLearningState();
    updateSession(); // Restart session with new context
  });

  modeSelect.addEventListener("change", () => {
    learningState.mode = modeSelect.value;
    updateLearningUI();
    saveLearningState();
    updateSession(); // Restart session with new context
  });

  newLessonButton.addEventListener("click", async () => {
    const confirmed = await showConfirmModal(
      "Start New Lesson",
      "This will clear your current conversation and start fresh. Are you sure you want to continue?"
    );

    if (confirmed) {
      responseArea.innerHTML = "";
      responseArea.style.display = "none";
      learningState.questionCount = 0;
      learningState.conversationHistory = [];
      updateLearningUI();
      saveLearningState();
      if (session) {
        session.destroy();
        session = null;
      }
      updateSession();
      promptInput.focus();
    }
  });





  copyNotesButton.addEventListener("click", () => {
    const notes = learningState.conversationHistory.map(conv =>
      `Q: ${conv.question}\nA: ${conv.answer}\n---\n`
    ).join('\n');

    navigator.clipboard.writeText(notes).then(() => {
      copyNotesButton.textContent = "✅ Copied!";
      setTimeout(() => {
        copyNotesButton.textContent = "📋 Copy Notes";
      }, 2000);
    }).catch(async () => {
      await showAlertModal("Copy Failed", "Failed to copy notes to clipboard. Please try again or copy manually.");
    });
  });

  // Help button to show welcome modal
  if (helpButton) {
    helpButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log('Help button clicked');
      showWelcomeModal();
    });
  }

  sessionTemperature.addEventListener("input", () => {
    tempValue.textContent = sessionTemperature.value;
    updateSession();
  });



  // Focus Area Input
  focusArea.addEventListener("input", () => {
    learningState.focusArea = focusArea.value.trim();
    saveLearningState();
  });

  // Response Length Change
  responseLengthSelect.addEventListener("change", () => {
    learningState.responseLength = responseLengthSelect.value;
    saveLearningState();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await promptModel();
  });

  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  promptInput.addEventListener("focus", () => {
    promptInput.select();
  });

  promptInput.addEventListener("input", async () => {
    const value = promptInput.value.trim();
    if (!value || !session) {
      costSpan.textContent = "";
      return;
    }

    try {
      let cost;
      if (session.countPromptTokens) {
        cost = await session.countPromptTokens(value);
      } else if (session.measureInputUsage) {
        cost = await session.measureInputUsage(value);
      }

      if (cost) {
        costSpan.textContent = `${cost} token${cost === 1 ? '' : 's'}`;
      }
    } catch (error) {
      // Silently handle token counting errors
      costSpan.textContent = "";
    }
  });

  const resetUI = () => {
    problematicArea.style.display = "none";
    promptInput.focus();
  };

  const updateSession = async () => {
    if (session) {
      session.destroy();
    }

    if (self.LanguageModel) {
      try {
        session = await LanguageModel.create({
          temperature: Number(sessionTemperature.value),
          topK: 8, // Fixed reasonable value
          initialPrompts: [
            {
              role: 'system',
              content: generateSystemPrompt(),
            }
          ],
        });

        offlineStatus.textContent = "🟢 Offline Ready";
        updateSessionInfo();

      } catch (error) {
        console.error("Failed to create session:", error);
        offlineStatus.textContent = "🔴 Session Error";
        sessionInfo.textContent = "Session: Error";

        // Show user-friendly error modal
        await showAlertModal(
          "Session Error",
          "Failed to create AI session. Please try refreshing the page or check if the AI model is properly installed."
        );
      }
    }
    resetUI();
  };

  // Initialize the learning hub
  if (!session) {
    let { defaultTemperature, maxTemperature } = "LanguageModel" in self ?
      await LanguageModel.params() : { defaultTemperature: 0.7, maxTemperature: 2 };

    sessionTemperature.value = defaultTemperature || 0.7;
    sessionTemperature.max = maxTemperature || 2;
    tempValue.textContent = sessionTemperature.value;

    await updateSession();
  }





  // Analyze learning patterns and provide insights
  const analyzeAndUpdateLearningPatterns = (question, answer) => {
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();

    // Simple keyword analysis for learning areas
    const mathKeywords = ['equation', 'solve', 'calculate', 'formula', 'algebra', 'geometry', 'calculus'];
    const scienceKeywords = ['experiment', 'hypothesis', 'theory', 'molecule', 'atom', 'energy', 'force'];
    const languageKeywords = ['grammar', 'sentence', 'paragraph', 'essay', 'writing', 'literature', 'poetry'];

    // Check for difficulty indicators in responses
    const complexityIndicators = ['advanced', 'complex', 'difficult', 'challenging', 'sophisticated'];
    const simplicityIndicators = ['basic', 'simple', 'fundamental', 'elementary', 'introduction'];

    // Update learning areas based on content
    if (mathKeywords.some(keyword => questionLower.includes(keyword) || answerLower.includes(keyword))) {
      updateLearningArea('math', complexityIndicators.some(indicator => answerLower.includes(indicator)));
    }

    if (scienceKeywords.some(keyword => questionLower.includes(keyword) || answerLower.includes(keyword))) {
      updateLearningArea('science', complexityIndicators.some(indicator => answerLower.includes(indicator)));
    }

    if (languageKeywords.some(keyword => questionLower.includes(keyword) || answerLower.includes(keyword))) {
      updateLearningArea('language', complexityIndicators.some(indicator => answerLower.includes(indicator)));
    }
  };

  const updateLearningArea = (area, isComplex) => {
    if (isComplex) {
      if (!learningState.strongAreas.includes(area)) {
        learningState.strongAreas.push(area);
      }
      learningState.weakAreas = learningState.weakAreas.filter(weak => weak !== area);
    } else {
      if (!learningState.weakAreas.includes(area) && !learningState.strongAreas.includes(area)) {
        learningState.weakAreas.push(area);
      }
    }
  };

  // Provide learning suggestions
  const provideLearningTips = () => {
    const tips = [
      "💡 Try explaining concepts in your own words to test understanding",
      "🔄 Review previous topics regularly to strengthen memory",
      "❓ Don't hesitate to ask follow-up questions for clarity",
      "📝 Take notes on key concepts for better retention",
      "🎯 Focus on one topic at a time for deeper learning",
      "🔗 Try to connect new concepts to things you already know",
      "⏰ Take breaks every 25-30 minutes to stay focused",
      "🗣️ Teach someone else what you've learned"
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  };

  // Show learning tip occasionally
  const showLearningTip = () => {
    if (learningState.questionCount > 0 && learningState.questionCount % 5 === 0) {
      const tip = provideLearningTips();
      const tipDiv = document.createElement("div");
      tipDiv.classList.add("message", "tip-message");
      tipDiv.innerHTML = `
        <div class="message-header">
          <span class="message-role">💡 Learning Tip</span>
          <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${tip}</div>
      `;
      responseArea.append(tipDiv);
    }
  };

  // Update study time periodically
  setInterval(() => {
    if (learningState.sessionStartTime) {
      updateLearningUI();
    }
  }, 60000); // Update every minute

  // Welcome Modal functionality
  const welcomeModal = document.getElementById("welcome-modal");
  const welcomeClose = document.getElementById("welcome-close");
  const welcomeStartButton = document.getElementById("welcome-start-button");

  console.log('Welcome modal elements:', { welcomeModal, welcomeClose, welcomeStartButton });

  const showWelcomeModal = () => {
    console.log('showWelcomeModal called');
    console.log('welcomeModal element:', welcomeModal);
    if (welcomeModal) {
      welcomeModal.classList.add('show');
      welcomeModal.style.display = "flex";
      console.log('Welcome modal shown with class and style');
      console.log('Welcome modal computed style:', window.getComputedStyle(welcomeModal).display);
    } else {
      console.error('Welcome modal element not found');
    }
  };

  const hideWelcomeModal = () => {
    console.log('hideWelcomeModal called');
    if (welcomeModal) {
      welcomeModal.classList.remove('show');
      welcomeModal.style.display = "none";
      localStorage.setItem('hasSeenWelcome', 'true');
      console.log('Welcome modal hidden');
      if (promptInput) {
        promptInput.focus();
      }
    }
  };

  // Welcome modal event listeners with better error handling
  if (welcomeClose) {
    welcomeClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideWelcomeModal();
    });
  }

  if (welcomeStartButton) {
    welcomeStartButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideWelcomeModal();
    });
  }

  // Close modal when clicking outside
  if (welcomeModal) {
    welcomeModal.addEventListener("click", (event) => {
      if (event.target === welcomeModal) {
        hideWelcomeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && welcomeModal && welcomeModal.style.display === "flex") {
      hideWelcomeModal();
    }
  });

  // Show welcome modal on first launch
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
  console.log('Has seen welcome:', hasSeenWelcome);

  // Force show welcome modal for testing (remove this line after testing)
  localStorage.removeItem('hasSeenWelcome');
  console.log('Forcing welcome modal to show for testing');
  showWelcomeModal();

  if (!hasSeenWelcome) {
    console.log('First launch - showing welcome modal');
    showWelcomeModal();
  }

  // Custom Modal Functions
  const showConfirmModal = (title, message) => {
    return new Promise((resolve) => {
      const confirmModal = document.getElementById("confirm-modal");
      const confirmTitle = document.getElementById("confirm-title");
      const confirmMessage = document.getElementById("confirm-message");
      const confirmOk = document.getElementById("confirm-ok");
      const confirmCancel = document.getElementById("confirm-cancel");

      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      confirmModal.classList.add("show");

      const handleConfirm = () => {
        confirmModal.classList.remove("show");
        confirmOk.removeEventListener("click", handleConfirm);
        confirmCancel.removeEventListener("click", handleCancel);
        resolve(true);
      };

      const handleCancel = () => {
        confirmModal.classList.remove("show");
        confirmOk.removeEventListener("click", handleConfirm);
        confirmCancel.removeEventListener("click", handleCancel);
        resolve(false);
      };

      confirmOk.addEventListener("click", handleConfirm);
      confirmCancel.addEventListener("click", handleCancel);

      // Close when clicking outside modal
      const handleOutsideClick = (event) => {
        if (event.target === confirmModal) {
          confirmModal.removeEventListener("click", handleOutsideClick);
          handleCancel();
        }
      };
      confirmModal.addEventListener("click", handleOutsideClick);

      // Close with Escape key
      const handleEscape = (event) => {
        if (event.key === "Escape") {
          document.removeEventListener("keydown", handleEscape);
          confirmModal.removeEventListener("click", handleOutsideClick);
          handleCancel();
        }
      };
      document.addEventListener("keydown", handleEscape);
    });
  };

  const showAlertModal = (title, message) => {
    return new Promise((resolve) => {
      const alertModal = document.getElementById("alert-modal");
      const alertTitle = document.getElementById("alert-title");
      const alertMessage = document.getElementById("alert-message");
      const alertOk = document.getElementById("alert-ok");

      alertTitle.textContent = title;
      alertMessage.textContent = message;
      alertModal.classList.add("show");

      const handleOk = () => {
        alertModal.classList.remove("show");
        alertOk.removeEventListener("click", handleOk);
        resolve();
      };

      alertOk.addEventListener("click", handleOk);

      // Close when clicking outside modal
      const handleOutsideClick = (event) => {
        if (event.target === alertModal) {
          alertModal.removeEventListener("click", handleOutsideClick);
          handleOk();
        }
      };
      alertModal.addEventListener("click", handleOutsideClick);

      // Close with Escape key
      const handleEscape = (event) => {
        if (event.key === "Escape") {
          document.removeEventListener("keydown", handleEscape);
          alertModal.removeEventListener("click", handleOutsideClick);
          handleOk();
        }
      };
      document.addEventListener("keydown", handleEscape);
    });
  };

  promptInput.focus();
})();