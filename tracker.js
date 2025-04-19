// Tracker variables
let currentWeekStart = null;
const habitLabels = ['Bible Study', 'Journaling', 'Hydrated', 'Workout', 'Read a Book', 'Study'];

// Initialize the tracker component
function initializeTracker() {
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    
    // Set initial week to current week
    currentWeekStart = getStartOfWeek(new Date());
    
    // Add event listeners
    prevWeekBtn.addEventListener('click', () => {
        currentWeekStart = addDays(currentWeekStart, -7);
        renderTracker();
    });
    
    nextWeekBtn.addEventListener('click', () => {
        currentWeekStart = addDays(currentWeekStart, 7);
        renderTracker();
    });
    
    renderTracker();
}

// Get the start date of the week (Sunday)
function getStartOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay(); // 0 for Sunday, 1 for Monday, etc.
    result.setDate(result.getDate() - day);
    return result;
}

// Format week display
function formatWeekDisplay(weekStart) {
    const weekEnd = addDays(weekStart, 6);
    const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const year = weekEnd.getFullYear();
    
    if (startMonth === endMonth) {
        return `Week of ${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
        return `Week of ${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
}

// Render tracker table
function renderTracker() {
    const trackerContainer = document.getElementById('trackerContainer');
    const weekDisplay = document.getElementById('currentWeekDisplay');
    
    // Update week display
    weekDisplay.textContent = formatWeekDisplay(currentWeekStart);
    
    // Create tracker table
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Habit</th>
    `;
    
    // Generate column headers for each day of the week
    for (let i = 0; i < 7; i++) {
        const day = addDays(currentWeekStart, i);
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = day.getDate();
        tableHTML += `<th>${dayName}<br>${dayNum}</th>`;
    }
    
    tableHTML += `
                </tr>
            </thead>
            <tbody>
    `;
    
    // Generate rows for each habit
    habitLabels.forEach(habit => {
        tableHTML += `<tr><td>${habit}</td>`;
        
        // Generate cells for each day
        for (let i = 0; i < 7; i++) {
            const day = addDays(currentWeekStart, i);
            const dateStr = dateToYMD(day);
            const checked = isHabitCompleted(habit, dateStr);
            
            tableHTML += `
    <td class="habit-cell">
        <input type="checkbox" class="habit-checkbox" 
            data-habit="${habit}" 
            data-date="${dateStr}" 
            ${checked ? 'checked' : ''}>
    </td>
`;
// Add this at the end of renderTracker function after setting innerHTML
const checkboxes = document.querySelectorAll('.habit-checkbox');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const habit = this.getAttribute('data-habit');
        const date = this.getAttribute('data-date');
        toggleHabit(habit, date, this.checked);
    });
});
        }
        
        tableHTML += `</tr>`;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    trackerContainer.innerHTML = tableHTML;
}

// Check if a habit was completed on a specific date
function isHabitCompleted(habit, dateStr) {
    if (!userData || !userData.habits || !userData.habits[dateStr]) {
        return false;
    }
    
    return userData.habits[dateStr].includes(habit);
}

// Toggle habit completion
function toggleHabit(habit, dateStr, completed) {
    // Initialize habits object if needed
    if (!userData.habits) {
        userData.habits = {};
    }
    
    // Initialize array for this date if needed
    if (!userData.habits[dateStr]) {
        userData.habits[dateStr] = [];
    }
    
    if (completed) {
        // Add habit if not already in array
        if (!userData.habits[dateStr].includes(habit)) {
            userData.habits[dateStr].push(habit);
        }
    } else {
        // Remove habit if in array
        userData.habits[dateStr] = userData.habits[dateStr].filter(h => h !== habit);
    }
    
    // Save updated data
    apiService.saveUserData(userData);
}

// Make toggleHabit globally accessible
window.toggleHabit = toggleHabit;
