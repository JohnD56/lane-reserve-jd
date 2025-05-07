//john delgado
// global arrays for lanes and waitlist
let lanes = [];
let waitlist = [];
let timerInterval;

// grab elements once
const lanesContainer = document.getElementById('lanes');
const waitlistList = document.getElementById('waitlistList');
const setLanesBtn = document.getElementById('setLanesBtn');
const reserveAllBtn = document.getElementById('reserveAllBtn');

// bind buttons
setLanesBtn.addEventListener('click', initLanes);
reserveAllBtn.addEventListener('click', attemptReservation);

// set up default lanes on load
initLanes();

function initLanes() {
  // read and clamp lane count
  let num = parseInt(document.getElementById('numLanes').value, 10) || 0;
  if (num > 4) {
    alert('Cannot set more than 4 lanes.');
    document.getElementById('numLanes').value = 4;
    return;
  }
  // reset arrays and restart timer
  lanes = Array(num).fill(null);
  waitlist = [];
  clearInterval(timerInterval);
  render();
  timerInterval = setInterval(tickTimers, 1000);
}

function render() {
  lanesContainer.innerHTML = '';
  // build each lane card
  lanes.forEach((res, i) => {
    const card = document.createElement('div');
    card.className = `lane ${res ? 'reserved' : 'free'}`;
    if (res) {
      card.innerHTML = `
        <h2>Lane ${i+1}</h2>
        <p>Reserved by ${res.name}</p>
        <span class="timer" data-i="${i}">${formatTime(res.timeLeft)}</span>
        <button data-action="edit" data-i="${i}">Edit Reservation Name</button>
        <button data-action="addTime" data-i="${i}">+10 min</button>
        <button class="secondary" data-action="release" data-i="${i}">Release</button>
      `;
    } else {
      card.innerHTML = `
        <h2>Lane ${i+1}</h2>
        <p>Available</p>
        <button data-action="reserve" data-i="${i}">Reserve</button>
      `;
    }
    lanesContainer.appendChild(card);
  });
  attachListeners();
  updateWaitlist();
  updateActiveCount();
}

function attachListeners() {
  // wire up all lane buttons
  document.querySelectorAll('.lane button').forEach(btn => {
    const idx = +btn.dataset.i;
    const action = btn.dataset.action;
    btn.addEventListener('click', () => {
      if (action === 'reserve') reserveLane(idx);
      if (action === 'release') releaseLane(idx);
      if (action === 'edit') editName(idx);
      if (action === 'addTime') addTime(idx);
    });
  });
}

function reserveLane(i) {
  const name = prompt('Enter name:');
  if (name) {
    lanes[i] = { name, timeLeft: 600 }; // 10min
    render();
  }
}

function releaseLane(i) {
  lanes[i] = null;
  // push from waitlist if any
  if (waitlist.length) lanes[i] = waitlist.shift();
  render();
}

function editName(i) {
  const newName = prompt('New name:', lanes[i].name);
  if (newName) {
    lanes[i].name = newName;
    render();
  }
}

function addTime(i) {
  lanes[i].timeLeft += 600; // +10min
  updateTimerDisplay(i);
}

function attemptReservation() {
  const name = prompt('Enter name:');
  if (!name) return;
  const freeIdx = lanes.findIndex(l => !l);
  if (freeIdx > -1) lanes[freeIdx] = { name, timeLeft: 600 };
  else waitlist.push({ name, timeLeft: 600 });
  render();
}

function updateWaitlist() {
  waitlistList.innerHTML = '';
  waitlist.forEach((person, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${idx+1}. ${person.name}
      <button class="waitlist-remove-btn" data-i="${idx}" aria-label="Remove">
        <!-- trash SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7H6v7a.5.5 0 0 1-1 0v-7z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2h14v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
        </svg>
      </button>
    `;
    waitlistList.appendChild(li);
  });
  // remove handler
  document.querySelectorAll('.waitlist-remove-btn').forEach(btn => {
    const idx = +btn.dataset.i;
    btn.addEventListener('click', () => {
      waitlist.splice(idx, 1);
      render();
    });
  });
}

function tickTimers() {
  lanes.forEach((res, i) => {
    if (res) {
      res.timeLeft = Math.max(res.timeLeft - 1, 0);
      updateTimerDisplay(i);
      if (res.timeLeft === 0) releaseLane(i);
    }
  });
}

function updateTimerDisplay(i) {
  const span = document.querySelector(`.timer[data-i="${i}"]`);
  if (span && lanes[i]) span.textContent = formatTime(lanes[i].timeLeft);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function updateActiveCount() {
  const activeCount = lanes.filter(l => l).length;
  document.getElementById('activeLanesCount').textContent = activeCount;
}
