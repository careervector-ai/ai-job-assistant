console.log("🔥 Extension Injected");

// Theme state
let isDarkMode = true; // Default to dark mode for extension

function getJobDescription() {
  const selectors = [
    ".jobs-description-content__text",
    ".jobs-box__html-content",
    ".jobs-search__job-details--container",
    ".job-view-layout",
    "[class*='jobs-description']"
  ];

  for (let selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.length > 200) {
      return el.innerText;
    }
  }
  return "";
}

async function sendToBackend(text) {
  chrome.storage.local.get("userSkills", async (result) => {
    const userSkills = result.userSkills || [];

    try {
      const response = await fetch("http://localhost:5000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: text, userSkills })
      });

      const data = await response.json();
      saveJobHistory(data);
      showResult(data);

    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  });
}

async function saveJobHistory(data) {
  try {
    await fetch("http://localhost:5000/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: data.matchScore,
        matched: data.matchedSkills,
        missing: data.missingSkills,
        recommendation: data.recommendation
      })
    });
    console.log("✅ History saved to MongoDB");
  } catch (err) {
    console.error("❌ History save error:", err);
  }
}

function makeDraggable(div) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const handle = div.querySelector("#ai-drag-handle");

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - div.getBoundingClientRect().left;
    offsetY = e.clientY - div.getBoundingClientRect().top;
    div.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Keep within viewport
    newLeft = Math.max(0, Math.min(window.innerWidth - div.offsetWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - div.offsetHeight, newTop));

    div.style.left = newLeft + "px";
    div.style.top = newTop + "px";
    div.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    div.style.cursor = "default";

    // Save position to chrome.storage
    chrome.storage.local.set({
      boxPosition: {
        top: div.style.top,
        left: div.style.left
      }
    });
  });
}

function toggleTheme(div) {
  isDarkMode = !isDarkMode;
  const themeColors = getThemeColors();
  applyTheme(div, themeColors);
  chrome.storage.local.set({ extensionTheme: isDarkMode });
}

function getThemeColors() {
  if (isDarkMode) {
    return {
      bg: "#2d2d2d",
      text: "#ffffff",
      border: "#0a66c2",
      shadow: "0 8px 32px rgba(0,0,0,0.3)",
      neumorph: "9px 9px 16px #1a1a1a, -9px -9px 16px #404040",
      matchedBg: "rgba(34, 197, 94, 0.1)",
      matchedText: "#4ade80",
      missingBg: "rgba(239, 68, 68, 0.1)",
      missingText: "#f87171",
      buttonBg: "#0a66c2",
      buttonHover: "#004182"
    };
  } else {
    return {
      bg: "#f0f0f3",
      text: "#1a1a1a",
      border: "#0a66c2",
      shadow: "0 8px 32px rgba(0,0,0,0.1)",
      neumorph: "9px 9px 16px #d1d1d4, -9px -9px 16px #ffffff",
      matchedBg: "#f0fdf4",
      matchedText: "#166534",
      missingBg: "#fef2f2",
      missingText: "#991b1b",
      buttonBg: "#0a66c2",
      buttonHover: "#004182"
    };
  }
}

function applyTheme(div, colors) {
  div.style.background = colors.bg;
  div.style.color = colors.text;
  div.style.border = `1px solid ${colors.border}`;
  div.style.boxShadow = colors.neumorph;
  
  // Update all elements inside
  const dragHandle = div.querySelector("#ai-drag-handle");
  const dragSpan = dragHandle?.querySelector("span:first-child");
  const dragHint = dragHandle?.querySelector("span:last-child");
  
  if (dragSpan) dragSpan.style.color = colors.text === "#ffffff" ? "#9ca3af" : "#6b7280";
  if (dragHint) dragHint.style.color = colors.text === "#ffffff" ? "#6b7280" : "#9ca3af";
  
  const matchedDiv = div.querySelector("#ai-matched-skills");
  const missingDiv = div.querySelector("#ai-missing-skills");
  
  if (matchedDiv) {
    matchedDiv.style.background = colors.matchedBg;
    matchedDiv.style.color = colors.matchedText;
  }
  if (missingDiv) {
    missingDiv.style.background = colors.missingBg;
    missingDiv.style.color = colors.missingText;
  }
  
  const button = div.querySelector("#ai-dashboard-btn");
  if (button) {
    button.style.background = colors.buttonBg;
    button.onmouseover = () => button.style.background = colors.buttonHover;
    button.onmouseout = () => button.style.background = colors.buttonBg;
  }
}

function showResult(data) {
  const existing = document.getElementById("ai-job-box");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "ai-job-box";

  const matched = data.matchedSkills || [];
  const missing = data.missingSkills || [];
  const recommendation = data.recommendation || "N/A";
  const matchScore = data.matchScore || 0;
  
  // Get recommendation color
  let recColor = "#0a66c2";
  let recBg = "rgba(10, 102, 194, 0.1)";
  if (recommendation.includes("APPLY")) {
    recColor = "#22c55e";
    recBg = "rgba(34, 197, 94, 0.1)";
  } else if (recommendation.includes("MAYBE")) {
    recColor = "#eab308";
    recBg = "rgba(234, 179, 8, 0.1)";
  } else if (recommendation.includes("SKIP")) {
    recColor = "#ef4444";
    recBg = "rgba(239, 68, 68, 0.1)";
  }

  div.innerHTML = `
    <style>
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .ai-animate-in {
        animation: slideIn 0.3s ease-out;
      }
      .ai-skill-tag {
        transition: all 0.2s ease;
      }
      .ai-skill-tag:hover {
        transform: translateY(-1px);
      }
    </style>

    <div id="ai-drag-handle" style="
      cursor: grab;
      font-size: 11px;
      margin-bottom: 12px;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(128, 128, 128, 0.2);
    ">
      <span style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 14px;">🤖</span>
        <span style="font-weight: 600;">AI Job Assistant</span>
      </span>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span id="ai-theme-toggle" style="
          font-size: 14px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 6px;
          transition: all 0.2s;
        ">🌓</span>
        <span style="font-size: 9px; opacity: 0.6;">drag to move</span>
      </div>
    </div>

    <!-- Match Score Circle -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <div style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        background: conic-gradient(#0a66c2 0deg ${matchScore * 3.6}deg, #e5e7eb ${matchScore * 3.6}deg 360deg);
        position: relative;
      ">
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        ">
          ${matchScore}%
        </div>
      </div>
      <div style="flex: 1;">
        <div style="
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 8px;
          display: inline-block;
          background: ${recBg};
          color: ${recColor};
        ">
          ${recommendation}
        </div>
      </div>
    </div>

    <!-- Matched Skills -->
    <div style="margin-bottom: 12px;">
      <div style="font-size: 11px; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
        <span>✅</span> Matched Skills
      </div>
      <div id="ai-matched-skills" style="
        padding: 8px;
        border-radius: 8px;
        font-size: 10px;
        line-height: 1.5;
      ">
        ${matched.length ? matched.map(skill => 
          `<span class="ai-skill-tag" style="
            display: inline-block;
            margin: 2px 4px 2px 0;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 9px;
          ">✓ ${skill}</span>`
        ).join('') : '<span style="opacity: 0.6;">None</span>'}
      </div>
    </div>

    <!-- Missing Skills -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
        <span>📚</span> Skills to Learn
      </div>
      <div id="ai-missing-skills" style="
        padding: 8px;
        border-radius: 8px;
        font-size: 10px;
        line-height: 1.5;
      ">
        ${missing.length ? missing.map(skill => 
          `<span class="ai-skill-tag" style="
            display: inline-block;
            margin: 2px 4px 2px 0;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 9px;
          ">+ ${skill}</span>`
        ).join('') : '<span style="opacity: 0.6;">None - Great match!</span>'}
      </div>
    </div>

    <button id="ai-dashboard-btn" style="
      width: 100%;
      margin-top: 4px;
      padding: 10px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    ">
      <span>🚀</span> View Dashboard
    </button>
  `;

  // Apply base styles
  const baseColors = getThemeColors();
  Object.assign(div.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px",
    borderRadius: "16px",
    zIndex: "9999",
    width: "280px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    transition: "all 0.3s ease",
    backdropFilter: "blur(0px)",
    cursor: "default"
  });

  document.body.appendChild(div);
  
  // Apply theme
  applyTheme(div, baseColors);
  div.classList.add("ai-animate-in");

  // Restore saved position
  chrome.storage.local.get("boxPosition", (result) => {
    if (result.boxPosition) {
      div.style.top = result.boxPosition.top;
      div.style.left = result.boxPosition.left;
      div.style.right = "auto";
    }
  });

  // Load saved theme preference
  chrome.storage.local.get("extensionTheme", (result) => {
    if (result.extensionTheme !== undefined) {
      isDarkMode = result.extensionTheme;
      const savedColors = getThemeColors();
      applyTheme(div, savedColors);
    }
  });

  // Make draggable
  makeDraggable(div);

  // Theme toggle button
  const themeToggle = div.querySelector("#ai-theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTheme(div);
    });
  }

  // Dashboard button
  document.getElementById("ai-dashboard-btn").addEventListener("click", () => {
    window.open("http://localhost:3000/dashboard", "_blank");
  });
}

// Debounced MutationObserver
let lastText = "";
let debounceTimer = null;

function observeJobChanges() {
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const text = getJobDescription();
      if (text && text.length > 200 && text !== lastText) {
        lastText = text;
        console.log("🔄 New job detected");
        sendToBackend(text);
      }
    }, 400);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

observeJobChanges();