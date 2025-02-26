document.querySelectorAll('.toggle-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove active class from all options
        document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        this.classList.add('active');
        
        const type = this.dataset.type;
        const paceInput = document.getElementById('paceInput');
        const timeInput = document.getElementById('timeInput');
        
        if (type === 'pace') {
            paceInput.classList.remove('hidden');
            timeInput.classList.add('hidden');
        } else {
            paceInput.classList.add('hidden');
            timeInput.classList.remove('hidden');
        }
    });
});

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function calculateTimeForPace(paceMinutes, paceSeconds, distance) {
    const totalSecondsPerMile = (paceMinutes * 60) + paceSeconds;
    const totalSeconds = totalSecondsPerMile * distance;
    return formatTime(totalSeconds);
}

function generatePaceTable(baseMinutes, baseSeconds) {
    const distances = [
        { name: '5K', distance: 3.1 },
        { name: '10K', distance: 6.2 },
        { name: 'Half Marathon', distance: 13.1 },
        { name: 'Marathon', distance: 26.2 }
    ];

    let tableHTML = `
        <table class="pace-table">
            <thead>
                <tr>
                    <th>Distance</th>`;
    
    // Generate pace variations (-20 sec, -10 sec, base pace, +10 sec, +20 sec)
    const variations = [-20, -10, 0, 10, 20];
    variations.forEach(variation => {
        let totalSeconds = (baseMinutes * 60 + baseSeconds + variation);
        let mins = Math.floor(totalSeconds / 60);
        let secs = totalSeconds % 60;
        tableHTML += `<th>${mins}:${secs.toString().padStart(2, '0')}/mi</th>`;
    });

    tableHTML += `</tr></thead><tbody>`;

    distances.forEach(dist => {
        tableHTML += `<tr><td>${dist.name}</td>`;
        variations.forEach(variation => {
            let totalSeconds = (baseMinutes * 60 + baseSeconds + variation);
            let mins = Math.floor(totalSeconds / 60);
            let secs = totalSeconds % 60;
            tableHTML += `<td>${calculateTimeForPace(mins, secs, dist.distance)}</td>`;
        });
        tableHTML += `</tr>`;
    });

    tableHTML += `</tbody></table>`;
    return tableHTML;
}

function calculate() {
    const calculationType = document.querySelector('.toggle-option.active').dataset.type;
    const resultElement = document.getElementById('result');
    
    if (calculationType === 'pace') {
        // Calculate marathon time from pace
        const minutes = parseInt(document.getElementById('paceMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('paceSeconds').value) || 0;
        
        if (minutes === 0 && seconds === 0) {
            resultElement.textContent = 'Please enter a valid pace';
            return;
        }

        const totalSecondsPerMile = (minutes * 60) + seconds;
        const marathonDistanceMiles = 26.2;
        const totalSeconds = totalSecondsPerMile * marathonDistanceMiles;
        
        const marathonHours = Math.floor(totalSeconds / 3600);
        const marathonMinutes = Math.floor((totalSeconds % 3600) / 60);
        const marathonSeconds = Math.floor(totalSeconds % 60);
        
        resultElement.innerHTML = `
            <div class="result-section">
                <div class="result-header">
                    <h2>Your Marathon Time</h2>
                    <p style="font-size: 24px; font-weight: 600; color: var(--primary-color); margin-bottom: 24px; text-align: center;">
                        ${marathonHours}:${marathonMinutes.toString().padStart(2, '0')}:${marathonSeconds.toString().padStart(2, '0')}
                    </p>
                    <h2>Estimated Race Times</h2>
                </div>
                <div class="table-container">
                    ${generatePaceTable(minutes, seconds)}
                </div>
            </div>
        `;
    } else {
        // Calculate pace from marathon time
        const hours = parseInt(document.getElementById('timeHours').value) || 0;
        const minutes = parseInt(document.getElementById('timeMinutes').value) || 0;
        
        if (hours === 0 && minutes === 0) {
            resultElement.textContent = 'Please enter a valid marathon time';
            return;
        }

        const totalSeconds = (hours * 3600) + (minutes * 60);
        const marathonDistanceMiles = 26.2;
        const secondsPerMile = totalSeconds / marathonDistanceMiles;
        
        const paceMinutes = Math.floor(secondsPerMile / 60);
        const paceSeconds = Math.floor(secondsPerMile % 60);
        
        resultElement.innerHTML = `
            <div class="result-section">
                <div class="result-header">
                    <h2>Your Mile Pace</h2>
                    <p style="font-size: 24px; font-weight: 600; color: var(--primary-color); margin-bottom: 24px; text-align: center;">
                        ${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} per mile
                    </p>
                    <h2>Estimated Race Times</h2>
                </div>
                <div class="table-container">
                    ${generatePaceTable(paceMinutes, paceSeconds)}
                </div>
            </div>
        `;
    }
} 