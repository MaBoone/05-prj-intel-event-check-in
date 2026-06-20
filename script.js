// Get All DOM Elem
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greetingEl = document.getElementById("greeting");
const attendeeListEl = document.getElementById("attendeeList");

// Team counters
const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");

// Storage key
const STORAGE_KEY = "intelAttendance_v1";

// Attendance data
let data = {
  count: 0,
  maxCount: 50,
  teams: { water: 0, zero: 0, power: 0 },
  attendees: []
};

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save attendance data:", e);
  }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // shallow merge for compatibility
      data = Object.assign({}, data, parsed);
      data.teams = Object.assign({}, data.teams, (parsed.teams || {}));
      data.attendees = parsed.attendees || data.attendees;
    }
  } catch (e) {
    console.error("Failed to load attendance data:", e);
  }
}

function formatTeamName(key) {
  if (key === "water") return "Team Water Wise";
  if (key === "zero") return "Team Net Zero";
  if (key === "power") return "Team Renewables";
  return key;
}

function render() {
  attendeeCountEl.textContent = data.count;
  waterCountEl.textContent = data.teams.water;
  zeroCountEl.textContent = data.teams.zero;
  powerCountEl.textContent = data.teams.power;

  const pct = Math.min(100, Math.round((data.count / data.maxCount) * 100));
  progressBar.style.width = pct + "%";

  renderAttendeesList();

  // Celebration when goal reached
  if (data.count >= data.maxCount) {
    const winningKey = getWinningTeamKey();
    const winningName = formatTeamName(winningKey);
    greetingEl.textContent = `🎉 Goal reached! Winning team: ${winningName}`;
    greetingEl.classList.add("success-message", "celebration");
    greetingEl.style.display = "block";
  } else {
    greetingEl.classList.remove("celebration");
    if (!greetingEl.textContent) greetingEl.style.display = "none";
  }
}

function getWinningTeamKey() {
  const t = data.teams;
  const entries = Object.entries(t);
  entries.sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : "water";
}

function renderAttendeesList() {
  attendeeListEl.innerHTML = "";
  if (!data.attendees || data.attendees.length === 0) return;
  data.attendees.forEach(function (att) {
    const li = document.createElement("li");
    li.className = "attendee-item";
    const teamBadge = document.createElement("span");
    teamBadge.className = `attendee-team ${att.team}`;
    teamBadge.textContent = att.teamName;
    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-name";
    nameSpan.textContent = att.name;
    li.appendChild(nameSpan);
    li.appendChild(teamBadge);
    attendeeListEl.appendChild(li);
  });
}

// Initialize from storage
loadData();
render();

// Handle Submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = (nameInput.value || "").trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0]
    ? teamSelect.selectedOptions[0].text
    : formatTeamName(team);

  if (!name || !team) return;

  // Add attendee
  const attendee = { name: name, team: team, teamName: teamName };
  data.attendees.unshift(attendee);

  // Increment counts
  data.count = (data.count || 0) + 1;
  if (!data.teams) data.teams = { water: 0, zero: 0, power: 0 };
  data.teams[team] = (data.teams[team] || 0) + 1;

  // Greeting message
  greetingEl.textContent = `Welcome, ${name} — ${teamName}`;
  greetingEl.classList.add("success-message");
  greetingEl.style.display = "block";

  // Persist and re-render
  saveData();
  render();

  form.reset();
  nameInput.focus();
});