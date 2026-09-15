// Main app: routing, quiz rendering, progress tracking, terminal sandbox tasks.

const STORAGE_KEY = "linux101-progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

let progress = loadProgress();

const sidebarEl = document.getElementById("sidebar");
const contentEl = document.getElementById("content");
const progressSummaryEl = document.getElementById("progress-summary");

function updateProgressSummary() {
  const total = MODULES.length;
  const done = MODULES.filter((m) => progress[m.id] && progress[m.id].completed).length;
  progressSummaryEl.textContent = `${done}/${total} modules completed`;
}

function renderSidebar(activeId) {
  sidebarEl.innerHTML = "";

  const homeLink = document.createElement("a");
  homeLink.href = "#home";
  homeLink.className = "nav-item" + (activeId === "home" ? " active" : "");
  homeLink.textContent = "🏠 Home";
  sidebarEl.appendChild(homeLink);

  const termLink = document.createElement("a");
  termLink.href = "#terminal";
  termLink.className = "nav-item" + (activeId === "terminal" ? " active" : "");
  termLink.textContent = "💻 Terminal Sandbox";
  sidebarEl.appendChild(termLink);

  const title = document.createElement("div");
  title.className = "nav-section-title";
  title.textContent = "Quiz Modules";
  sidebarEl.appendChild(title);

  MODULES.forEach((m) => {
    const a = document.createElement("a");
    a.href = `#module-${m.id}`;
    a.className = "nav-item" + (activeId === m.id ? " active" : "");
    const label = document.createElement("span");
    label.textContent = `${m.id}. ${m.title}`;
    a.appendChild(label);
    if (progress[m.id] && progress[m.id].completed) {
      const badge = document.createElement("span");
      badge.className = "badge-done";
      badge.textContent = `✓ ${progress[m.id].score}/${progress[m.id].total}`;
      a.appendChild(badge);
    }
    sidebarEl.appendChild(a);
  });

  updateProgressSummary();
}

function renderHome() {
  contentEl.innerHTML = "";
  const header = document.createElement("div");
  header.className = "module-header";
  header.innerHTML = `<h2>Linux 101 — Practice Hub</h2>`;
  contentEl.appendChild(header);

  const intro = document.createElement("p");
  intro.style.color = "var(--muted)";
  intro.textContent = "Pick a module quiz to test what you learned, or open the Terminal Sandbox to practice real command syntax against a safe, simulated filesystem. Progress is saved locally in your browser.";
  contentEl.appendChild(intro);

  const grid = document.createElement("div");
  grid.className = "home-grid";
  MODULES.forEach((m) => {
    const card = document.createElement("a");
    card.className = "home-card";
    card.href = `#module-${m.id}`;
    const done = progress[m.id] && progress[m.id].completed;
    card.innerHTML = `<h3>${m.id}. ${m.title}</h3><p>${done ? `Completed — score ${progress[m.id].score}/${progress[m.id].total}` : "Not attempted yet"}</p>`;
    grid.appendChild(card);
  });
  contentEl.appendChild(grid);
}

function renderQuiz(moduleId) {
  const mod = MODULES.find((m) => m.id === moduleId);
  const questions = QUIZZES[moduleId] || [];
  if (!mod) {
    contentEl.innerHTML = "<p>Module not found.</p>";
    return;
  }

  contentEl.innerHTML = "";
  const header = document.createElement("div");
  header.className = "module-header";
  header.innerHTML = `<h2>${mod.id}. ${mod.title}</h2>`;
  const docLink = document.createElement("a");
  docLink.className = "doc-link";
  docLink.href = mod.doc;
  docLink.target = "_blank";
  docLink.rel = "noopener";
  docLink.textContent = "📖 Read the lesson";
  header.appendChild(docLink);
  contentEl.appendChild(header);

  const state = { answers: new Array(questions.length).fill(null) };

  questions.forEach((q, qi) => {
    const card = document.createElement("div");
    card.className = "question-card";
    const h3 = document.createElement("h3");
    h3.textContent = `${qi + 1}. ${q.q}`;
    card.appendChild(h3);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";

    q.options.forEach((opt, oi) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if (state.answers[qi] !== null) return;
        state.answers[qi] = oi;
        Array.from(optionsWrap.children).forEach((child, idx) => {
          child.disabled = true;
          if (idx === q.answer) child.classList.add("correct");
          else if (idx === oi) child.classList.add("incorrect");
        });
        const explain = card.querySelector(".explain");
        explain.classList.add("show");
      });
      optionsWrap.appendChild(btn);
    });

    card.appendChild(optionsWrap);

    const explain = document.createElement("div");
    explain.className = "explain";
    explain.textContent = `💡 ${q.explain}`;
    card.appendChild(explain);

    contentEl.appendChild(card);
  });

  const footer = document.createElement("div");
  footer.className = "quiz-footer";
  const submitBtn = document.createElement("button");
  submitBtn.className = "primary";
  submitBtn.textContent = "Finish & Save Score";
  const scoreBanner = document.createElement("span");
  scoreBanner.className = "score-banner";
  footer.appendChild(submitBtn);
  footer.appendChild(scoreBanner);
  contentEl.appendChild(footer);

  submitBtn.addEventListener("click", () => {
    const answered = state.answers.filter((a) => a !== null).length;
    if (answered < questions.length) {
      scoreBanner.textContent = `Please answer all ${questions.length} questions (${answered} answered so far).`;
      return;
    }
    const score = state.answers.filter((a, i) => a === questions[i].answer).length;
    progress[moduleId] = { completed: true, score, total: questions.length };
    saveProgress(progress);
    scoreBanner.textContent = `Score: ${score}/${questions.length} — saved!`;
    renderSidebar(moduleId);

    const ratio = score / questions.length;
    const hardBank = HARD_QUESTIONS[moduleId];
    if (ratio >= 0.8 && hardBank && hardBank.length) {
      renderAgentBonusRound(moduleId, hardBank);
    }
  });
}

// Agent-driven bonus round: unlocked only once the base quiz is mastered (>=80%).
function renderAgentBonusRound(moduleId, hardBank) {
  agent.unlockHard(moduleId);

  const banner = document.createElement("div");
  banner.className = "question-card";
  banner.innerHTML = `<h3>🤖 Tutor Agent: nice work — here are tougher, scenario-based questions to push further.</h3>`;
  contentEl.appendChild(banner);

  const bonusState = { answers: new Array(hardBank.length).fill(null) };

  hardBank.forEach((q, qi) => {
    const card = document.createElement("div");
    card.className = "question-card";
    const h3 = document.createElement("h3");
    h3.textContent = `🔥 Bonus ${qi + 1}. ${q.q}`;
    card.appendChild(h3);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";

    q.options.forEach((opt, oi) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if (bonusState.answers[qi] !== null) return;
        bonusState.answers[qi] = oi;
        Array.from(optionsWrap.children).forEach((child, idx) => {
          child.disabled = true;
          if (idx === q.answer) child.classList.add("correct");
          else if (idx === oi) child.classList.add("incorrect");
        });
        card.querySelector(".explain").classList.add("show");
      });
      optionsWrap.appendChild(btn);
    });
    card.appendChild(optionsWrap);

    const explain = document.createElement("div");
    explain.className = "explain";
    explain.textContent = `💡 ${q.explain}`;
    card.appendChild(explain);

    contentEl.appendChild(card);
  });
}

const agent = new TutorAgent();

function renderTerminal() {
  contentEl.innerHTML = "";
  const header = document.createElement("div");
  header.className = "module-header";
  header.innerHTML = `<h2>💻 Terminal Sandbox — 🤖 Agent Mode</h2>`;
  contentEl.appendChild(header);

  const intro = document.createElement("p");
  intro.style.color = "var(--muted)";
  intro.textContent = "A simulated shell (no real system access, no API calls) so you can safely practice command syntax. The Tutor Agent gives you one task at a time and gets tougher as you clear each tier. Type 'help' to see supported commands.";
  contentEl.appendChild(intro);

  const tier = agent.currentTier();
  const tierBanner = document.createElement("div");
  tierBanner.className = "question-card";
  tierBanner.id = "agent-tier-banner";
  contentEl.appendChild(tierBanner);

  const taskListEl = document.createElement("ul");
  taskListEl.className = "task-list";
  contentEl.appendChild(taskListEl);

  const taskCtx = {};

  function refreshTaskPanel() {
    const currentTier = agent.currentTier();
    tierBanner.innerHTML = `<h3>🤖 Agent Tier ${currentTier.level + 1}: ${currentTier.label}</h3><p style="color:var(--muted);margin:0;">Complete every task in this tier to unlock a harder one.</p>`;
    taskListEl.innerHTML = "";
    currentTier.tasks.forEach((t) => {
      const li = document.createElement("li");
      li.dataset.taskId = t.id;
      if (agent.isChallengeDone(t.id)) li.classList.add("done");
      li.innerHTML = `<span class="task-check"></span><span>${t.desc}</span>`;
      taskListEl.appendChild(li);
    });
  }
  refreshTaskPanel();

  const wrap = document.createElement("div");
  wrap.className = "terminal-wrap";
  const output = document.createElement("div");
  output.id = "term-output";
  wrap.appendChild(output);

  const inputRow = document.createElement("div");
  inputRow.className = "term-input-row";
  const promptSpan = document.createElement("span");
  promptSpan.textContent = "$";
  const input = document.createElement("input");
  input.id = "term-input";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.placeholder = "type a command, e.g. ls -la";
  inputRow.appendChild(promptSpan);
  inputRow.appendChild(input);
  wrap.appendChild(inputRow);
  contentEl.appendChild(wrap);

  function askFollowUp(task) {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `<h3>🤖 Agent follow-up: ${task.followUp.q}</h3>`;
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";
    task.followUp.options.forEach((opt, oi) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        Array.from(optionsWrap.children).forEach((child, idx) => {
          child.disabled = true;
          if (idx === task.followUp.answer) child.classList.add("correct");
          else if (idx === oi) child.classList.add("incorrect");
        });
        card.querySelector(".explain").classList.add("show");
      });
      optionsWrap.appendChild(btn);
    });
    card.appendChild(optionsWrap);
    const explain = document.createElement("div");
    explain.className = "explain";
    explain.textContent = `💡 ${task.followUp.explain}`;
    card.appendChild(explain);
    contentEl.insertBefore(card, wrap);
  }

  const term = new Terminal(output, (name, args, fullCmd) => {
    const activeTask = agent.nextIncompleteTask();
    if (activeTask && activeTask.check(fullCmd, term, taskCtx)) {
      agent.markChallengeDone(activeTask.id);
      const li = taskListEl.querySelector(`li[data-task-id="${activeTask.id}"]`);
      if (li) li.classList.add("done");
      term.print(`✅ Task complete: ${activeTask.desc}`, "cmd-line");
      if (activeTask.followUp) askFollowUp(activeTask);
      const leveledUp = agent.maybeLevelUp();
      if (leveledUp) {
        term.print(`🎉 Tier cleared! The agent has unlocked a harder tier: ${agent.currentTier().label}`, "cmd-line");
        refreshTaskPanel();
      }
    }
  });

  term.print("Welcome to the Linux-101 practice terminal. Type 'help' for supported commands.");

  let historyIndex = -1;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      historyIndex = -1;
      term.run(val);
    } else if (e.key === "ArrowUp") {
      if (term.history.length === 0) return;
      historyIndex = historyIndex === -1 ? term.history.length - 1 : Math.max(0, historyIndex - 1);
      input.value = term.history[historyIndex] || "";
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (historyIndex === -1) return;
      historyIndex = Math.min(term.history.length - 1, historyIndex + 1);
      input.value = term.history[historyIndex] || "";
      e.preventDefault();
    }
  });

  input.focus();
}

function route() {
  const hash = window.location.hash.replace("#", "") || "home";
  if (hash === "home") {
    renderSidebar("home");
    renderHome();
  } else if (hash === "terminal") {
    renderSidebar("terminal");
    renderTerminal();
  } else if (hash.startsWith("module-")) {
    const id = hash.replace("module-", "");
    renderSidebar(id);
    renderQuiz(id);
  } else {
    renderSidebar("home");
    renderHome();
  }
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
