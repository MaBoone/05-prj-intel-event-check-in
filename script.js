// Get All DOM Elem
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Attendance
let count = 0;
const maxCount = 50;

// Handle Submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get Vals
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team);

  // Increment
  count++;
  console.log("Total check-ins: ", count);

  // Update Progress
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);

  // Update Team Count
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
  
  // Welcome Message
  const message = `Welcome, ${name} from ${teamName}`;
  console.log(message);

  form.reset();
});