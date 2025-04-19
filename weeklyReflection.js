// Weekly reflection variables
let currentReflectionWeek = 1;
let totalWeeks = 11; // 75 days = approximately 11 weeks

// Initialize the weekly reflection component
function initializeWeeklyReflection() {
    const prevWeekReflectionBtn = document.getElementById('prevWeekReflection');
    const nextWeekReflectionBtn = document.getElementById('nextWeekReflection');
    const saveReflectionBtn = document.getElementById('saveReflection');
    
    // Add event listeners
    prevWeekReflectionBtn.addEventListener('click', () => {
        if (currentReflectionWeek > 1) {
            currentReflectionWeek--;
            updateWeeklyReflection();
        }
    });
    
    nextWeekReflectionBtn.addEventListener('click', () => {
        if (currentReflectionWeek < totalWeeks) {
            currentReflectionWeek++;
            updateWeeklyReflection();
        }
    });
    
    saveReflectionBtn.addEventListener('click', () => {
        saveWeeklyReflection();
    });
    
    // Set initial week
    updateWeeklyReflection();
}

// Update weekly reflection display
function updateWeeklyReflection() {
    if (!startDate) return;
    
    const reflectionWeekDisplay = document.getElementById('reflectionWeekDisplay');
    
    // Calculate week start and end dates
    const weekStart = addDays(startDate, (currentReflectionWeek - 1) * 7);
    const weekEnd = addDays(weekStart, 6);
    
    // Update week display
    reflectionWeekDisplay.textContent = `Week ${currentReflectionWeek}: ${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`;
    
    // Load weekly reflection data
    loadWeeklyReflection();
}

// Format date in short form
function formatDateShort(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Load weekly reflection data
function loadWeeklyReflection() {
    if (!userData.weeklyReflections) {
        userData.weeklyReflections = {};
    }
    
    // Get reflection data for this week
    const reflectionData = userData.weeklyReflections[currentReflectionWeek] 
        ? userData.weeklyReflections[currentReflectionWeek] 
        : {
            deepClean: false,
            skinCare: false,
            reflection: ''
        };
    
    // Fill form with data
    document.getElementById('deepClean').checked = reflectionData.deepClean;
    document.getElementById('skinCare').checked = reflectionData.skinCare;
    document.getElementById('weeklyReflectionText').value = reflectionData.reflection;
}

// Save weekly reflection
function saveWeeklyReflection() {
    // Initialize weekly reflections object if needed
    if (!userData.weeklyReflections) {
        userData.weeklyReflections = {};
    }
    
    // Get form data
    const reflectionData = {
        deepClean: document.getElementById('deepClean').checked,
        skinCare: document.getElementById('skinCare').checked,
        reflection: document.getElementById('weeklyReflectionText').value.trim()
    };
    
    // Save data
    userData.weeklyReflections[currentReflectionWeek] = reflectionData;
    apiService.saveUserData(userData).then(() => {
        alert('Weekly reflection saved successfully!');
    });
}