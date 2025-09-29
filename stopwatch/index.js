// Get all necessary DOM elements
        const display = document.getElementById('display');
        const startBtn = document.getElementById('startBtn'); 
        const clearBtn = document.getElementById('clearBtn');
        const lapBtn = document.getElementById('lapBtn');
        const themeToggle = document.getElementById('themeToggle'); 
        const lapsContainer = document.getElementById('lapsContainer');

        // Initialize time variables and interval ID
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let milliseconds = 0;
        let intervalId;
        let isRunning = false;
        
        // Lap specific variables
        let lapCounter = 1;
        let totalMilliseconds = 0; // Tracks the absolute time in ms
        let lastLapTime = 0; // Tracks the total time (in ms) when the last lap was recorded

        // Function to format the time with leading zeros
        function formatTime(unit) {
            return unit < 10 ? '0' + unit : unit;
        }

        // Function to convert milliseconds into H:M:S:CS format
        function msToTimeFormat(ms) {
            let h = Math.floor(ms / 3600000);
            ms = ms % 3600000;
            let m = Math.floor(ms / 60000);
            ms = ms % 60000;
            let s = Math.floor(ms / 1000);
            let cs = Math.floor((ms % 1000) / 10); // Centiseconds

            return `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}:${formatTime(cs)}`;
        }

        // Function to update the stopwatch display
        function updateDisplay() {
            // Recalculate total milliseconds for cleaner time management for laps
            totalMilliseconds = (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + milliseconds;
            
            // Display formatted time
            const formattedMilliseconds = formatTime(Math.floor(milliseconds / 10));
            display.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}:${formattedMilliseconds}`;
        }

        // Main timer function
        function timer() {
            milliseconds += 10;
            if (milliseconds === 1000) {
                milliseconds = 0;
                seconds++;
                if (seconds === 60) {
                    seconds = 0;
                    minutes++;
                    if (minutes === 60) {
                        minutes = 0;
                        hours++;
                    }
                }
            }
            updateDisplay();
        }
        
        // Lap Functionality
        function recordLap() {
            // Calculate the time elapsed since the last lap or start
            const splitTime = totalMilliseconds - lastLapTime;
            
            // Update lastLapTime to the current total time
            lastLapTime = totalMilliseconds;
            
            // Format the split time and the overall time
            const overallTimeFormatted = msToTimeFormat(totalMilliseconds);
            const splitTimeFormatted = msToTimeFormat(splitTime);

            // Create the lap item element
            const lapItem = document.createElement('div');
            lapItem.classList.add('lap-item');
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${lapCounter}:</span>
                <span class="lap-time">${splitTimeFormatted}</span>
                <span class="overall-time">(${overallTimeFormatted})</span>
            `;
            
            // Prepend the new lap item to the container (newest lap at the top)
            lapsContainer.prepend(lapItem);
            
            lapCounter++;
            console.log(`Lap ${lapCounter - 1} recorded. Split: ${splitTimeFormatted}`);
        }


        // Event listener for the single Start/Pause/Resume button
        startBtn.addEventListener('click', () => {
            if (!isRunning) {
                // START/RESUME
                intervalId = setInterval(timer, 10);
                isRunning = true;
                startBtn.textContent = 'Pause';
                lapBtn.disabled = false; // Enable lap button when running
                console.log("Stopwatch started/resumed.");
            } else {
                // PAUSE
                clearInterval(intervalId);
                isRunning = false;
                startBtn.textContent = 'Resume';
                lapBtn.disabled = true; // Disable lap button when paused
                console.log("Stopwatch paused.");
            }
        });
        
        // Event listener for the Lap button
        lapBtn.addEventListener('click', recordLap);

        // Event listener for the Clear button (Reset function)
        clearBtn.addEventListener('click', () => {
            clearInterval(intervalId);
            isRunning = false;
            startBtn.textContent = 'Start';
            lapBtn.disabled = true; // Disable lap button on clear
            
            // Reset all time and lap variables
            hours = 0;
            minutes = 0;
            seconds = 0;
            milliseconds = 0;
            totalMilliseconds = 0;
            lastLapTime = 0;
            lapCounter = 1;
            lapsContainer.innerHTML = ''; // Clear lap list
            
            updateDisplay();
            console.log("Stopwatch cleared to 00:00:00:00.");
        });

        // Event listener for the theme toggle switch (Updated for checkbox 'change' event)
        themeToggle.addEventListener('change', () => {
            const body = document.body;
            
            // If themeToggle.checked is TRUE, we are in the default Dark theme (slider right)
            if (themeToggle.checked) {
                body.removeAttribute('data-theme');
                console.log("Theme switched to Dark (Switch On).");
            } 
            // If themeToggle.checked is FALSE, we switch to Light theme (slider left)
            else {
                body.setAttribute('data-theme', 'light');
                console.log("Theme switched to Light (Switch Off).");
            }
        });