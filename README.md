# 75 Days Challenge Tracker

A cute, pinkish-themed tracker application for the 75 Days Challenge with habit tracking, journals, and weekly reflections.

## Features

- **Daily Habit Tracker**: Track Bible study, journaling, hydration, workouts, reading, and studying
- **5-Minute Journal**: Morning and evening reflections with gratitude, goals, and achievements
- **Bible Study Journal**: Record scripture readings with observations and applications
- **Weekly Reflections**: Weekly review with reminders for deep cleaning and skincare
- **Progress Counter**: Digital counter showing days, hours, minutes, and seconds
- **Data Persistence**: All your data is saved locally using JSON server

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling is with a cute pink theme (You can change this of course)
- `app.js` - Core app functionality and data management
- `tracker.js` - Habit tracking functionality
- `journal.js` - 5-minute journal functionality
- `bibleStudy.js` - Bible study journal functionality
- `weeklyReflection.js` - Weekly reflection functionality
- `db.json` - Database file for storing all user data
- `vercel.json` - Configuration for Vercel deployment

## Usage

1. When first opening the app, you'll be prompted to set your start date
2. Navigate through the tabs to access different features
3. Use the habit tracker to check off completed daily habits
4. Complete your 5-minute journal entries
5. Record your Bible study notes
6. At the end of each week, complete your weekly reflection
7. Use the settings page to update your start date or reset data if needed

## Customization

You can easily customize the app by modifying:
- Colors in the CSS `:root` variables to change the theme
- Habit labels in the `habitLabels` array in `tracker.js`
- Challenge rules in the HTML rules section

Enjoy your 75 Days Challenge!
