// script.js

// Initialize the calendar with the current month
const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');
const slotList = document.getElementById('slot-list');
const slotDuration = document.getElementById('slot-duration');
const timeSlotsContainer = document.getElementById('time-slots');
const selectedDateSpan = document.getElementById('selected-date');
const slotsContainer = document.getElementById('slots-container');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let selectedSlots = {};

// Event listeners for month navigation
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

// Initialize the calendar for the current month
updateCalendar();

// Update calendar when the month changes
function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// Generate the calendar for the specified month and year
function updateCalendar() {
    calendar.innerHTML = '';
    monthYear.innerText = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendar.appendChild(emptyDay);
    }

    for (let i = 1; i <= numDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const day = document.createElement('div');
        day.className = 'day';
        day.innerText = `${daysOfWeek[date.getDay()]} ${i}`;
        day.dataset.date = date.toDateString();
        day.addEventListener('click', () => showTimeSlots(day));
        calendar.appendChild(day);
    }
}

// Show time slots for the selected day
function showTimeSlots(day) {
    selectedDate = new Date(day.dataset.date);
    selectedDateSpan.innerText = selectedDate.toDateString();
    timeSlotsContainer.classList.remove('hidden');

    // Generate time slots
    slotsContainer.innerHTML = '';
    const duration = parseInt(slotDuration.value, 10);
    const numSlots = 24 * (60 / duration);

    for (let i = 0; i < numSlots; i++) {
        const slot = document.createElement('div');
        const slotTime = new Date(selectedDate.getTime() + i * duration * 60000);
        const hours = slotTime.getHours().toString().padStart(2, '0');
        const minutes = slotTime.getMinutes().toString().padStart(2, '0');
        slot.className = 'slot';
        slot.innerText = `${hours}:${minutes}`;
        slot.dataset.time = slotTime.toISOString();
        slot.dataset.endTime = new Date(slotTime.getTime() + duration * 60000).toISOString();
        slot.addEventListener('click', () => selectSlot(slot));
        slotsContainer.appendChild(slot);
    }
}

// Handle slot selection
function selectSlot(slot) {
    const slotTime = new Date(slot.dataset.time);
    const endTime = new Date(slot.dataset.endTime);
    const dateKey = slotTime.toDateString();
    const slotText = `from ${formatTime(slotTime)} to ${formatTime(endTime)}`;

    if (slot.classList.contains('selected')) {
        slot.classList.remove('selected');
        removeSlot(dateKey, slotText);
    } else {
        slot.classList.add('selected');
        addSlot(dateKey, slotText);
    }
}

// Add selected slot to the list
function addSlot(dateKey, slotText) {
    if (!selectedSlots[dateKey]) {
        selectedSlots[dateKey] = [];
    }
    selectedSlots[dateKey].push(slotText);
    renderSelectedSlots();
}

// Remove unselected slot from the list
function removeSlot(dateKey, slotText) {
    if (selectedSlots[dateKey]) {
        selectedSlots[dateKey] = selectedSlots[dateKey].filter(slot => slot !== slotText);
        if (selectedSlots[dateKey].length === 0) {
            delete selectedSlots[dateKey];
        }
        renderSelectedSlots();
    }
}

// Render the selected slots grouped by date
function renderSelectedSlots() {
    slotList.innerHTML = '';
    for (const [date, slots] of Object.entries(selectedSlots)) {
        const dateHeader = document.createElement('li');
        dateHeader.innerText = date;
        dateHeader.style.fontWeight = 'bold';
        slotList.appendChild(dateHeader);

        slots.forEach(slotText => {
            const li = document.createElement('li');
            li.innerText = slotText;
            li.style.marginLeft = '20px';
            slotList.appendChild(li);
        });
    }
}

// Format time as hh:mm
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
