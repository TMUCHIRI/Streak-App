// console.log("hello");

interface Habit {
    name: string;
    startDate: string;
}

async function fetchHabits(): Promise<Habit[]> {
    const response = await fetch('http://localhost:3000/habits');
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched habits:', data); // produce an array directly
    return data; 
}

async function saveHabit(habit: Habit): Promise<void> {
    const response = await fetch('http://localhost:3000/habits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(habit)
    });

    if (!response.ok) {
        throw new Error('Failed to save habit');
    }
}

function calculateStreak(startDate: string): number {
    const start = new Date(startDate);
    const today = new Date();
    const timeDifference = today.getTime() - start.getTime();
    const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return dayDifference + 1; // +1 to include the start day itself
}

function displayHabits(habits: Habit[]): void {
    const streaksContainer = document.getElementById('streaks') as HTMLDivElement;
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

async function addHabit(event: Event): Promise<void> {
    event.preventDefault();

    const habitInput = document.getElementById('habit') as HTMLInputElement;
    const dateInput = document.getElementById('date') as HTMLInputElement;

    if (!habitInput.value || !dateInput.value) {
        alert('Please enter both a habit and a start date.');
        return;
    }

    const selectedDate = new Date(dateInput.value);
    const currentDate = new Date();

    if(selectedDate > currentDate){
        alert('Date selected cannot be in the future.');
        return;
    }

    const newHabit: Habit = {
        name: habitInput.value,
        startDate: dateInput.value
    };

    try {
        await saveHabit(newHabit);
        const habits = await fetchHabits();
        displayHabits(habits);
    } catch (error) {
        console.error('Error adding habit:', error);
    }

    habitInput.value = '';
    dateInput.value = '';
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const habits = await fetchHabits();
        displayHabits(habits);

        const button = document.querySelector('.plusBtn button') as HTMLButtonElement;
        button.addEventListener('click', addHabit);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});
