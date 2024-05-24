"use strict";
// console.log("hello");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchHabits() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/habits');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = yield response.json();
        console.log('Fetched habits:', data); // produce an array directly
        return data;
    });
}
function saveHabit(habit) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habit)
        });
        if (!response.ok) {
            throw new Error('Failed to save habit');
        }
    });
}
function calculateStreak(startDate) {
    const start = new Date(startDate);
    const today = new Date();
    const timeDifference = today.getTime() - start.getTime();
    const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return dayDifference + 1; // +1 to include the start day itself
}
function displayHabits(habits) {
    const streaksContainer = document.getElementById('streaks');
    streaksContainer.innerHTML = '<h3>MY STREAKS</h3>';
    habits.forEach(habit => {
        const habitDiv = document.createElement('div');
        habitDiv.className = 'habit';
        const streak = calculateStreak(habit.startDate);
        habitDiv.innerHTML = `
            <p><ion-icon name="calendar-outline" style="color:white;"></ion-icon></P
            <p>Habit: ${habit.name}</p>
            <p>Started on: ${habit.startDate}</p>
            <p>Current Streak: ${streak} days</p>
        `;
        streaksContainer.appendChild(habitDiv);
    });
}
function addHabit(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const habitInput = document.getElementById('habit');
        const dateInput = document.getElementById('date');
        if (!habitInput.value || !dateInput.value) {
            alert('Please enter both a habit and a start date.');
            return;
        }
        const selectedDate = new Date(dateInput.value);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            alert('Date selected cannot be in the future.');
            return;
        }
        const newHabit = {
            name: habitInput.value,
            startDate: dateInput.value
        };
        try {
            yield saveHabit(newHabit);
            const habits = yield fetchHabits();
            displayHabits(habits);
        }
        catch (error) {
            console.error('Error adding habit:', error);
        }
        habitInput.value = '';
        dateInput.value = '';
    });
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const habits = yield fetchHabits();
        displayHabits(habits);
        const button = document.querySelector('.plusBtn button');
        button.addEventListener('click', addHabit);
    }
    catch (error) {
        console.error('Error initializing app:', error);
    }
}));
