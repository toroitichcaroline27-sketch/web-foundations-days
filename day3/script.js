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