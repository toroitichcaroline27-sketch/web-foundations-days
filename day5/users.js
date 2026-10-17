// 1. Select DOM elements using their IDs
const loadBtn = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMsg = document.getElementById("status");
const usersList = document.getElementById("users-list");

// 2. Global array to store fetched users for local filtering
let usersData = [];

// 3. Render function: takes an array of users and displays them on the page
function renderUsers(list) {
  // Clear any existing list items first
  usersList.textContent = "";

  // Show message if no users match
  if (list.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No users match your filter.";
    usersList.appendChild(emptyLi);
    return;
  }

  // Loop through each user object and build HTML structure
  list.forEach((user) => {
    const li = document.createElement("li");

    const nameHeading = document.createElement("strong");
    nameHeading.textContent = user.name;

    const details = document.createElement("p");
    // Handle city/company structure gracefully from API
    const city = user.address ? user.address.city : (user.city || "N/A");
    const company = user.company ? (user.company.name || user.company) : "N/A";
    
    details.textContent = `Email: ${user.email} | City: ${city} | Company: ${company}`;

    li.appendChild(nameHeading);
    li.appendChild(details);
    usersList.appendChild(li);
  });
}