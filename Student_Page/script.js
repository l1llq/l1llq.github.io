let timerInterval; // Variable to store the timer interval

function navigateTo(page) {
    window.location.href = page;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tabs-container button');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    document.querySelector(`.tabs-container button[onclick="switchTab('${tabId}')"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function startTimer() { // for the Now Pass timer
    const dropdown1 = document.getElementById('departing-1');
    const dropdown2 = document.getElementById('destination-1');
    const recentContainer1 = document.getElementById('recent-container-1');
    const recentContainer2 = document.getElementById('recent-container-2');
    const departure = dropdown1.value;
    const destination = dropdown2.value;
    const button = document.getElementById('timer-button');
    const display = document.getElementById('timer-display');
    let timeLeft = 10 * 60; // 10 minutes in seconds

    // Check if both dropdown menus have selections
    if (!departure || !destination) {
        alert('Please select an option in both dropdown menus before starting.');
        return;
    }

    if (button.textContent === 'Start Time') {
        button.textContent = 'Stop'; // Change button text to "Stop"
        display.style.display = "block";
        
        // Start the timer
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval); // Stop the timer when time is up
                display.textContent = 'Time is up!'; // Show time's up message
                button.textContent = 'Start Time'; // Reset button text to "Start Time"
            } else {
                // Update the timer every second
                timeLeft--;
                let minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                display.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`; // Display the time left
            }
            
        }, 1000);

    } else if (button.textContent === 'Stop') {
        display.style.display = "none"; // make the timer reset and disapear
        display.textContent = "";
        clearInterval(timerInterval); // Stop the timer
        button.textContent = 'Start Time'; // Reset the button text to "Start Time"
        
        // Add to recent selections for Dropdown 1
        addToRecent(departure, recentContainer1, dropdown1);

        // Add to recent selections for Dropdown 2
        addToRecent(destination, recentContainer2, dropdown2);
    }
}

function startSubmit() {       
    const dropdown1 = document.getElementById('departing-2');
    const dropdown2 = document.getElementById('destination-2');
    const recentContainer1 = document.getElementById('recent-container-3');
    const recentContainer2 = document.getElementById('recent-container-4');
    const datetime = document.getElementById('datetime').value;
    const departure = dropdown1.value;
    const destination = dropdown2.value;
    const student = 'John Doe';

    if (!departure || !destination || !datetime) {
        alert('Please input all fields: Departure, Destination, Time.');
        return;
    }

    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

    submissions.push({
        student,
        departure,
        destination,
        time: new Date(datetime).toLocaleString(),
    });

    // Save submission in local storage
    localStorage.setItem('submissions', JSON.stringify(submissions));
    alert('Appointment pass succesfully submitted to Teacher!');
    // Add to recent selections for Dropdown 1
    addToRecent(departure, recentContainer1, dropdown1);
    // Add to recent selections for Dropdown 2
    addToRecent(destination, recentContainer2, dropdown2);
    
}

// Helper function to format time (e.g., 9 seconds as 09)
function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

// Helper function to add to recently selected lists
function addToRecent(selectedValue, recentContainer, dropdown) {
    const storageKey = dropdown.name; // Unique key for each dropdown
    
    // Check if the selection already exists in recent selections
    const existingCard = Array.from(recentContainer.children).find(
        (card) => card.textContent === selectedValue
    );

    if (existingCard) {
        // Move the existing card to the front
        recentContainer.removeChild(existingCard);
        recentContainer.prepend(existingCard);
    } else {
        // Create a card for the new selection
        const selectionCard = document.createElement('div');
        selectionCard.className = 'selection-card';
        selectionCard.textContent = selectedValue;

        // Add click functionality to the card
        selectionCard.addEventListener('click', () => {
            dropdown.value = selectedValue;
        });

        // Prepend the card to the recent selections container
        recentContainer.prepend(selectionCard);

        // Limit the number of recent selections to 5
        if (recentContainer.childElementCount > 5) {
            recentContainer.removeChild(recentContainer.lastChild);
        }
    }

    // Save the updated list to local storage
    const recentSelections = Array.from(recentContainer.children).map((card) => card.textContent);
    localStorage.setItem(storageKey, JSON.stringify(recentSelections));
}

document.addEventListener('DOMContentLoaded', () => {
    const departureDropdown1 = document.getElementById('departing-1');
    const destinationDropdown1 = document.getElementById('destination-1');
    const recentDepartureContainer1 = document.getElementById('recent-container-1');
    const recentDestinationContainer1 = document.getElementById('recent-container-2');
    const departureDropdown2 = document.getElementById('departing-2');
    const destinationDropdown2 = document.getElementById('destination-2');
    const recentDepartureContainer2 = document.getElementById('recent-container-3');
    const recentDestinationContainer2 = document.getElementById('recent-container-4');

    // Load and rebuild recent lists from local storage
    function loadRecents(dropdown, recentContainer) {
        const storageKey = dropdown.name;
        const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedItems.reverse().forEach((item) => {
            addToRecent(item, recentContainer, dropdown);
        });
    }

    // localStorage.removeItem(departureDropdown1.name);
    // localStorage.removeItem(destinationDropdown1.name);
    // localStorage.removeItem(departureDropdown2.name);
    // localStorage.removeItem(destinationDropdown2.name);

    loadRecents(departureDropdown1, recentDepartureContainer1);
    loadRecents(destinationDropdown1, recentDestinationContainer1);
    loadRecents(departureDropdown2, recentDepartureContainer2);
    loadRecents(destinationDropdown2, recentDestinationContainer2);
});