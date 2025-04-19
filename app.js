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
    if (!startDate) return;
    
    const now = new Date();
    const elapsedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    
    // Clamp days between 0 and CHALLENGE_DAYS
    const displayDays = Math.max(0, Math.min(elapsedDays, CHALLENGE_DAYS));
    
    document.getElementById('dayCount').textContent = String(displayDays).padStart(2, '0');
    
    // If challenge completed or not started yet
    if (elapsedDays >= CHALLENGE_DAYS || elapsedDays < 0) {
        document.getElementById('hourCount').textContent = '00';
        document.getElementById('minuteCount').textContent = '00';
        document.getElementById('secondCount').textContent = '00';
        return;
    }
    
    // Calculate remaining time in current day
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeLeft = midnight - now;
    
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('hourCount').textContent = String(hours).padStart(2, '0');
    document.getElementById('minuteCount').textContent = String(minutes).padStart(2, '0');
    document.getElementById('secondCount').textContent = String(seconds).padStart(2, '0');
}

// Update settings display
function updateSettingsDisplay() {
    if (!startDate || !endDate) return;
    
    document.getElementById('changeStartDate').value = dateToYMD(startDate);
    document.getElementById('endDate').value = dateToYMD(endDate);
    
    // Update progress bar
    const now = new Date();
    const totalDuration = CHALLENGE_DAYS * 24 * 60 * 60 * 1000; // 75 days in milliseconds
    const elapsed = Math.min(now - startDate, totalDuration);
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