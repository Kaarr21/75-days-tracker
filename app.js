// Global variables
let startDate = null;
let endDate = null;
const CHALLENGE_DAYS = 75;
let userData = null;

// API Service
const apiService = {
    baseUrl: 'http://localhost:3000',
    
    async getUserData() {
        try {
            const response = await fetch(`${this.baseUrl}/userData`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },
    
    async saveUserData(data) {
        try {
            const response = await fetch(`${this.baseUrl}/userData`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to save user data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error saving user data:', error);
            return null;
        }
    },
    
    async initializeUserData() {
        try {
            const response = await fetch(`${this.baseUrl}/userData`);
            if (response.status === 404) {
                // Create initial user data if it doesn't exist
                const initialData = {
                    startDate: null,
                    habits: {},
                    journalEntries: {},
                    bibleStudies: {},
                    weeklyReflections: {}
                };
                
                await fetch(`${this.baseUrl}/userData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(initialData)
                });
                
                return initialData;
            } else if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error initializing user data:', error);
            return null;
        }
    }
};

// Utility functions
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function dateToYMD(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Start date modal
function setupStartDateModal() {
    const modal = document.getElementById('startModal');
    const startDateInput = document.getElementById('startDateInput');
    const setStartDateBtn = document.getElementById('setStartDate');
    
    // Set default date to today
    const today = new Date();
    startDateInput.value = dateToYMD(today);
    
    setStartDateBtn.addEventListener('click', () => {
        const selectedDate = new Date(startDateInput.value);
        setStartDate(selectedDate);
        modal.classList.remove('show');
        loadUserData();
    });
}

// Set or update start date
function setStartDate(date) {
    startDate = new Date(date);
    endDate = addDays(startDate, CHALLENGE_DAYS - 1);
    
    // Update user data
    userData.startDate = startDate.toISOString();
    apiService.saveUserData(userData);
    
    // Update UI
    updateCounter();
    updateSettingsDisplay();
}

// Update counter display
function updateCounter() {
    if (!startDate || !endDate) return;
    
    const now = new Date();
    
    // Calculate days completed so far (current day of the challenge)
    const elapsedMilliseconds = now - startDate;
    const daysElapsed = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
    
    // Clamp days between 0 and CHALLENGE_DAYS
    const currentDay = Math.max(0, Math.min(daysElapsed + 1, CHALLENGE_DAYS));
    
    // Update the day count (which shows what day of the challenge we're on)
    document.getElementById('dayCount').textContent = String(currentDay).padStart(2, '0');
    
    // Handle challenge states
    if (now < startDate) {
        // Challenge hasn't started yet
        document.getElementById('hourCount').textContent = '00';
        document.getElementById('minuteCount').textContent = '00';
        document.getElementById('secondCount').textContent = '00';
        return;
    }
    
    if (now > endDate) {
        // Challenge is over
        document.getElementById('hourCount').textContent = '00';
        document.getElementById('minuteCount').textContent = '00';
        document.getElementById('secondCount').textContent = '00';
        return;
    }
    
    // Calculate remaining time until end date - THIS IS THE KEY FIX
    const timeRemaining = endDate - now;
    
    // Convert remaining time to days, hours, minutes, seconds
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Update timer displays
    document.getElementById('hourCount').textContent = String(hoursRemaining).padStart(2, '0');
    document.getElementById('minuteCount').textContent = String(minutesRemaining).padStart(2, '0');
    document.getElementById('secondCount').textContent = String(secondsRemaining).padStart(2, '0');
}

// Update settings display
function updateSettingsDisplay() {
    if (!startDate || !endDate) return;
    
    document.getElementById('changeStartDate').value = dateToYMD(startDate);
    document.getElementById('endDate').value = dateToYMD(endDate);
    
    // Update progress bar
    const now = new Date();
    const totalDuration = CHALLENGE_DAYS * 24 * 60 * 60 * 1000; // 75 days in milliseconds
    const elapsed = Math.min(Math.max(0, now - startDate), totalDuration);
    const progress = Math.floor((elapsed / totalDuration) * 100);
    
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${progress}%`;
}

// Settings page functionality
function setupSettingsPage() {
    const updateStartDateBtn = document.getElementById('updateStartDate');
    const resetDataBtn = document.getElementById('resetData');
    
    updateStartDateBtn.addEventListener('click', () => {
        const newStartDate = new Date(document.getElementById('changeStartDate').value);
        setStartDate(newStartDate);
    });
    
    resetDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            userData = {
                startDate: null,
                habits: {},
                journalEntries: {},
                bibleStudies: {},
                weeklyReflections: {}
            };
            
            apiService.saveUserData(userData).then(() => {
                alert('All data has been reset.');
                location.reload();
            });
        }
    });
}

// Load all user data
async function loadUserData() {
    // Try to get existing user data
    userData = await apiService.getUserData();
    
    // If no user data exists, initialize it
    if (!userData) {
        userData = await apiService.initializeUserData();
    }
    
    // If we have a start date in the data, use it
    if (userData.startDate) {
        startDate = new Date(userData.startDate);
        endDate = addDays(startDate, CHALLENGE_DAYS - 1);
        updateCounter();
        updateSettingsDisplay();
    } else {
        // Show start date modal if no start date set
        document.getElementById('startModal').classList.add('show');
    }
    
    // Initialize other components
    initializeTracker();
    initializeJournal();
    initializeBibleStudy();
    initializeWeeklyReflection();
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    setupStartDateModal();
    setupSettingsPage();
    loadUserData();
    
    // Update counter every second
    setInterval(updateCounter, 1000);
});

// These functions need to be defined or implemented in your full code
function initializeTracker() {
    // Implementation needed
}

function initializeJournal() {
    // Implementation needed
}

function initializeBibleStudy() {
    // Implementation needed
}

function initializeWeeklyReflection() {
    // Implementation needed
}