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
// 4. Fetch users from API with async/await and try/catch/finally
async function loadUsers() {
  loadBtn.disabled = true;
  statusMsg.textContent = "Loading users...";
  usersList.textContent = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    usersData = data;

    statusMsg.textContent = `Successfully loaded ${data.length} users.`;
    renderUsers(usersData);
  } catch (error) {
    statusMsg.textContent = `Failed to load users: ${error.message}`;
  } finally {
    loadBtn.disabled = false;
  }
}

// 5. Event Listeners
loadBtn.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase().trim();
  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filteredUsers);
});