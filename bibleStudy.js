// Bible study variables
let currentBibleStudyDate = new Date();

// Initialize the Bible study component
function initializeBibleStudy() {
    const bibleStudyDateSelector = document.getElementById('bibleStudyDateSelector');
    const goToBibleDateBtn = document.getElementById('goToBibleDate');
    const saveBibleStudyBtn = document.getElementById('saveBibleStudy');
    
    // Set initial date to today
    bibleStudyDateSelector.value = dateToYMD(currentBibleStudyDate);
    updateBibleStudyDate(currentBibleStudyDate);
    
    // Add event listeners
    goToBibleDateBtn.addEventListener('click', () => {
        const selectedDate = new Date(bibleStudyDateSelector.value);
        updateBibleStudyDate(selectedDate);
    });
    
    saveBibleStudyBtn.addEventListener('click', () => {
        saveBibleStudyEntry();
    });
    
    // Load Bible study entry for current date
    loadBibleStudyEntry(currentBibleStudyDate);
}

// Update Bible study date display and data
function updateBibleStudyDate(date) {
    currentBibleStudyDate = new Date(date);
    
    // Update date display
    const bibleStudyCurrentDate = document.getElementById('bibleStudyCurrentDate');
    bibleStudyCurrentDate.textContent = formatDate(currentBibleStudyDate);
    
    // Load Bible study entry for the selected date
    loadBibleStudyEntry(currentBibleStudyDate);
}

// Load Bible study entry data
function loadBibleStudyEntry(date) {
    const dateStr = dateToYMD(date);
    
    // Get Bible study data for this date
    const bibleStudyData = userData.bibleStudies && userData.bibleStudies[dateStr] 
        ? userData.bibleStudies[dateStr] 
        : {
            book: '',
            chapter: '',
            verses: '',
            keyVerse: '',
            observations: '',
            application: '',
            prayer: ''
        };
    
    // Fill form with data
    document.getElementById('bibleBook').value = bibleStudyData.book;
    document.getElementById('bibleChapter').value = bibleStudyData.chapter;
    document.getElementById('bibleVerses').value = bibleStudyData.verses;
    document.getElementById('keyVerse').value = bibleStudyData.keyVerse;
    document.getElementById('observations').value = bibleStudyData.observations;
    document.getElementById('application').value = bibleStudyData.application;
    document.getElementById('prayer').value = bibleStudyData.prayer;
}

// Save Bible study entry
function saveBibleStudyEntry() {
    const dateStr = dateToYMD(currentBibleStudyDate);
    
    // Initialize Bible studies object if needed
    if (!userData.bibleStudies) {
        userData.bibleStudies = {};
    }
    
    // Get form data
    const bibleStudyData = {
        book: document.getElementById('bibleBook').value.trim(),
        chapter: document.getElementById('bibleChapter').value.trim(),
        verses: document.getElementById('bibleVerses').value.trim(),
        keyVerse: document.getElementById('keyVerse').value.trim(),
        observations: document.getElementById('observations').value.trim(),
        application: document.getElementById('application').value.trim(),
        prayer: document.getElementById('prayer').value.trim()
    };
    
    // Save data
    userData.bibleStudies[dateStr] = bibleStudyData;
    apiService.saveUserData(userData).then(() => {
        alert('Bible study saved successfully!');
    });
}