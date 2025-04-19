// Journal variables
let currentJournalDate = new Date();

// Initialize the journal component
function initializeJournal() {
    const journalDateSelector = document.getElementById('journalDateSelector');
    const goToJournalDateBtn = document.getElementById('goToJournalDate');
    const saveJournalBtn = document.getElementById('saveJournal');
    
    // Set initial date to today
    journalDateSelector.value = dateToYMD(currentJournalDate);
    updateJournalDate(currentJournalDate);
    
    // Add event listeners
    goToJournalDateBtn.addEventListener('click', () => {
        const selectedDate = new Date(journalDateSelector.value);
        updateJournalDate(selectedDate);
    });
    
    saveJournalBtn.addEventListener('click', () => {
        saveJournalEntry();
    });
    
    // Load journal entry for current date
    loadJournalEntry(currentJournalDate);
}

// Update journal date display and data
function updateJournalDate(date) {
    currentJournalDate = new Date(date);
    
    // Update date display
    const journalCurrentDate = document.getElementById('journalCurrentDate');
    journalCurrentDate.textContent = formatDate(currentJournalDate);
    
    // Load journal entry for the selected date
    loadJournalEntry(currentJournalDate);
}

// Load journal entry data
function loadJournalEntry(date) {
    const dateStr = dateToYMD(date);
    
    // Get journal data for this date
    const journalData = userData.journalEntries && userData.journalEntries[dateStr] 
        ? userData.journalEntries[dateStr] 
        : {
            gratitude: '',
            greatDay: '',
            affirmations: '',
            amazingThings: '',
            betterDay: ''
        };
    
    // Fill form with data
    document.getElementById('gratitude').value = journalData.gratitude;
    document.getElementById('greatDay').value = journalData.greatDay;
    document.getElementById('affirmations').value = journalData.affirmations;
    document.getElementById('amazingThings').value = journalData.amazingThings;
    document.getElementById('betterDay').value = journalData.betterDay;
}

// Save journal entry
function saveJournalEntry() {
    const dateStr = dateToYMD(currentJournalDate);
    
    // Initialize journal entries object if needed
    if (!userData.journalEntries) {
        userData.journalEntries = {};
    }
    
    // Get form data
    const journalData = {
        gratitude: document.getElementById('gratitude').value.trim(),
        greatDay: document.getElementById('greatDay').value.trim(),
        affirmations: document.getElementById('affirmations').value.trim(),
        amazingThings: document.getElementById('amazingThings').value.trim(),
        betterDay: document.getElementById('betterDay').value.trim()
    };
    
    // Save data
    userData.journalEntries[dateStr] = journalData;
    apiService.saveUserData(userData).then(() => {
        alert('Journal entry saved successfully!');
    });
}