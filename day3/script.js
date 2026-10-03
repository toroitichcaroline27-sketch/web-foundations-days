let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Caroline", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];
// Step 2: Search notes by keyword (case-insensitive)
function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

// Test cases for searchNotes
console.log("Search 'day':", searchNotes("day")); 
// Expected: Array with Note 2 ("Finish the Day 3 assignment")

console.log("Search 'python':", searchNotes("python")); 
// Expected: [] (empty array since no notes contain "python")
// Step 3: Return note object with most characters, or null if empty
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  return notes.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );
}

// Test cases for longestNote
console.log("Longest Note:", longestNote());
// Expected: Note 3 ("Email the project report to Caroline")

// Edge case test (temporarily pass empty array check scenario)
const tempNotes = notes;
notes = [];
console.log("Longest Note (empty array):", longestNote());
// Expected: null
notes = tempNotes; // Restore original array
// Step 4: Return object counting notes per category
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// Test cases for countByCategory
console.log("Category Counts:", countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// Edge case test with empty notes array
const tempNotes2 = notes;
notes = [];
console.log("Category Counts (empty array):", countByCategory());
// Expected: {}
notes = tempNotes2; // Restore array
// Step 5: Return summary sentence using countByCategory and template literals
function getSummary() {
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";

  if (total === 0) {
    return "0 notes.";
  }

  const counts = countByCategory();
  const categoryParts = Object.entries(counts).map(
    ([cat, count]) => `${count} ${cat}`
  );

  return `${total} ${word}: ${categoryParts.join(", ")}.`;
}

// Test cases for getSummary
console.log("Summary:", getSummary());
// Expected: "5 notes: 2 personal, 2 study, 1 work."

// Edge case test for single note pluralization
const originalNotes = notes;
notes = [{ id: 1, text: "Buy milk", category: "personal" }];
console.log("Summary (1 note):", getSummary());
// Expected: "1 note: 1 personal."
notes = originalNotes; // Restore original notes array
// Step 6: Return true if note text exists (ignoring case and extra spaces)
function isDuplicate(text) {
  const normalizedInput = text.trim().toLowerCase();
  return notes.some(
    (note) => note.text.trim().toLowerCase() === normalizedInput
  );
}

// Test cases for isDuplicate
console.log("Is duplicate ('Call mum'):", isDuplicate("Call mum"));
// Expected: true

console.log("Is duplicate ('  CALL MUM  '):", isDuplicate("  CALL MUM  "));
// Expected: true (ignores spaces and upper case)

console.log("Is duplicate ('Buy coffee'):", isDuplicate("Buy coffee"));
// Expected: false
// Step 7: Add a note with input validation and duplicate checking
function addNote(text, category) {
  const trimmedText = text.trim();
  const allowedCategories = ["personal", "work", "study"];

  // 1. Length validation (1-200 characters)
  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("Validation Failed: Note text must be between 1 and 200 characters.");
    return false;
  }

  // 2. Category validation
  if (!allowedCategories.includes(category)) {
    console.log(`Validation Failed: Category '${category}' is invalid. Must be personal, work, or study.`);
    return false;
  }

  // 3. Duplicate validation
  if (isDuplicate(trimmedText)) {
    console.log("Validation Failed: Duplicate note detected.");
    return false;
  }

  // If all checks pass, construct new note and add to array
  const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  const newNote = {
    id: newId,
    text: trimmedText,
    category: category,
  };

  notes.push(newNote);
  console.log(`Note successfully added: "${trimmedText}" [${category}]`);
  return true;
}

// Test cases for addNote
console.log("\n--- Testing addNote ---");

// Test 1: Successful addition
console.log("Add valid note:", addNote("Prepare presentation for Monday", "work"));
// Expected: true and success log

// Test 2: Invalid category edge case
console.log("Add invalid category:", addNote("Go to gym", "fitness"));
// Expected: false and category error log

// Test 3: Duplicate note edge case
console.log("Add duplicate note:", addNote("Call mum", "personal"));
// Expected: false and duplicate error log