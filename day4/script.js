// Step 3: DOM Element Selection
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// Step 3.1: Function to calculate and update character/word counts
function updateCounts() {
  const text = noteText.value;
  const length = text.length;

  // Update character count display text
  charCount.textContent = `${length} / 200 characters`;

  // Calculate word count cleanly
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

  // Reset classes first
  charCount.classList.remove("warning", "over");

  // Apply warning (>180) or over (>200) styling rules
  if (length > 200) {
    charCount.classList.add("over");
  } else if (length > 180) {
    charCount.classList.add("warning");
  }
}
// Step 4: Handle input event to update counts and save draft in localStorage
noteText.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("draftText", noteText.value);
});

// Step 5: Function to restore saved draft on page load
function restoreDraft() {
  const savedDraft = localStorage.getItem("draftText");
  if (savedDraft !== null) {
    noteText.value = savedDraft;
  }
}
// Step 6: Function to clear textarea, reset counters, and remove draft from localStorage
function clearAll() {
  noteText.value = "";
  localStorage.removeItem("draftText");
  updateCounts();
}

// Event listener for Clear button click
clearBtn.addEventListener("click", clearAll);

// Event listener for pressing Escape key inside the textarea
noteText.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    clearAll();
  }
});
