// Game state
let currentHour = 4;
let currentMinute = 0;
let targetHour = 4;
let targetMinute = 0;
let isDragging = false;
let currentHand = null;
let gameStarted = false;
let currentAudio = null;

// Audio files
const audioFiles = {
    instruction: 'AUDIOS/set the clock to.mp3',
    hours: {
        1: 'AUDIOS/hours/1.mp3',
        2: 'AUDIOS/hours/2.mp3',
        3: 'AUDIOS/hours/3.mp3',
        4: 'AUDIOS/hours/4.mp3',
        5: 'AUDIOS/hours/5.mp3',
        6: 'AUDIOS/hours/6.mp3',
        7: 'AUDIOS/hours/7.mp3',
        8: 'AUDIOS/hours/8.mp3',
        9: 'AUDIOS/hours/9.mp3',
        10: 'AUDIOS/hours/10.mp3',
        11: 'AUDIOS/hours/11.mp3',
        12: 'AUDIOS/hours/12.mp3'
    },
    minutes: {
        5: 'AUDIOS/Minutes/05.mp3',
        10: 'AUDIOS/Minutes/10.mp3',
        15: 'AUDIOS/Minutes/15.mp3',
        20: 'AUDIOS/Minutes/20.mp3',
        25: 'AUDIOS/Minutes/25.mp3',
        30: 'AUDIOS/Minutes/30.mp3',
        35: 'AUDIOS/Minutes/35.mp3',
        40: 'AUDIOS/Minutes/40.mp3',
        45: 'AUDIOS/Minutes/45.mp3',
        50: 'AUDIOS/Minutes/50.mp3',
        55: 'AUDIOS/Minutes/55.mp3'
    },
    oclock: {
        1: 'AUDIOS/oclock/1 oclock.mp3',
        2: 'AUDIOS/oclock/2 oclock.mp3',
        3: 'AUDIOS/oclock/3 oclock.mp3',
        4: 'AUDIOS/oclock/4 oclock.mp3',
        5: 'AUDIOS/oclock/5 oclock.mp3',
        6: 'AUDIOS/oclock/6 oclock.mp3',
        7: 'AUDIOS/oclock/7 oclock.mp3',
        8: 'AUDIOS/oclock/8 oclock.mp3',
        9: 'AUDIOS/oclock/9 oclock.mp3',
        10: 'AUDIOS/oclock/10 oclock.mp3',
        11: 'AUDIOS/oclock/11 oclock.mp3',
        12: 'AUDIOS/oclock/12 oclock.mp3'
    }
};

// DOM elements
const startBtn = document.getElementById('startBtn');
const instruction = document.getElementById('instruction');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const displayHour = document.getElementById('displayHour');
const displayMinute = document.getElementById('displayMinute');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const feedback = document.getElementById('feedback');
const soundBtn = document.getElementById('soundBtn');

// Initialize clock hands
function initClock() {
    updateClockHands();
    updateDigitalDisplay();
}

// Update clock hands rotation
function updateClockHands() {
    const hourRotation = (currentHour % 12) * 30 + (currentMinute / 60) * 30;
    const minuteRotation = currentMinute * 6;
    
    hourHand.style.transform = `rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `rotate(${minuteRotation}deg)`;
}

// Update digital display
function updateDigitalDisplay() {
    displayHour.textContent = currentHour.toString().padStart(2, '0');
    displayMinute.textContent = currentMinute.toString().padStart(2, '0');
}

// Play audio sequence
async function playAudioSequence() {
    if (!soundEnabled) return;
    
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    const audio = new Audio();
    currentAudio = audio;
    
    // Play "set the clock to"
    audio.src = audioFiles.instruction;
    await audio.play();
    await new Promise(resolve => audio.onended = resolve);
    
    if (!soundEnabled) return;
    
    // Play hour
    const hourAudio = new Audio(audioFiles.hours[targetHour]);
    currentAudio = hourAudio;
    await hourAudio.play();
    await new Promise(resolve => hourAudio.onended = resolve);
    
    if (!soundEnabled) return;
    
    // Play minute or o'clock
    if (targetMinute === 0) {
        const oclockAudio = new Audio(audioFiles.oclock[targetHour]);
        currentAudio = oclockAudio;
        await oclockAudio.play();
    } else {
        const minuteAudio = new Audio(audioFiles.minutes[targetMinute]);
        currentAudio = minuteAudio;
        await minuteAudio.play();
    }
    
    currentAudio = null;
}

// Generate random time
function generateRandomTime() {
    // Random hour (1-12)
    targetHour = Math.floor(Math.random() * 12) + 1;
    
    // Random minute (only multiples of 5: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    targetMinute = minutes[Math.floor(Math.random() * minutes.length)];
    
    // Reset current time
    currentHour = 12;
    currentMinute = 0;
    
    updateClockHands();
    updateDigitalDisplay();
}

// Start game
function startGame() {
    gameStarted = true;
    startBtn.classList.add('hidden');
    instruction.innerHTML = '<p>Listen to the instruction and set the clock!</p>';
    
    generateRandomTime();
    playAudioSequence();
}

// Check answer
function checkAnswer() {
    const isCorrect = currentHour === targetHour && currentMinute === targetMinute;
    
    if (isCorrect) {
        feedback.textContent = 'Correct! Great job! 🎉';
        feedback.className = 'feedback correct';
        checkBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
    } else {
        feedback.textContent = 'Try again! Listen carefully.';
        feedback.className = 'feedback incorrect';
        playAudioSequence();
    }
}

// Next question
function nextQuestion() {
    feedback.textContent = '';
    feedback.className = 'feedback';
    checkBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    
    generateRandomTime();
    playAudioSequence();
}

// Calculate angle from mouse position
function getAngle(element, event) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    return angle;
}

// Handle hand rotation
function rotateHand(hand, angle) {
    if (hand === hourHand) {
        // Snap to nearest hour (30 degree increments)
        const snappedAngle = Math.round(angle / 30) * 30;
        currentHour = Math.round(snappedAngle / 30) % 12;
        if (currentHour === 0) currentHour = 12;
        
        // Adjust hour based on minute
        currentHour = currentHour + Math.floor(currentMinute / 60);
        if (currentHour > 12) currentHour -= 12;
        if (currentHour === 0) currentHour = 12;
    } else if (hand === minuteHand) {
        // Snap to nearest 5 minutes (30 degree increments)
        const snappedAngle = Math.round(angle / 30) * 30;
        currentMinute = Math.round(snappedAngle / 6);
        if (currentMinute === 60) currentMinute = 0;
    }
    
    updateClockHands();
    updateDigitalDisplay();
}

// Mouse/Touch event handlers
function handleStart(event, hand) {
    isDragging = true;
    currentHand = hand;
    event.preventDefault();
}

function handleMove(event) {
    if (!isDragging || !currentHand) return;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    const clock = document.querySelector('.clock');
    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    rotateHand(currentHand, angle);
}

function handleEnd() {
    isDragging = false;
    currentHand = null;
}

// Event listeners
startBtn.addEventListener('click', startGame);
checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);

// Mouse events
hourHand.addEventListener('mousedown', (e) => handleStart(e, hourHand));
minuteHand.addEventListener('mousedown', (e) => handleStart(e, minuteHand));
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);

// Touch events
hourHand.addEventListener('touchstart', (e) => handleStart(e, hourHand));
minuteHand.addEventListener('touchstart', (e) => handleStart(e, minuteHand));
document.addEventListener('touchmove', handleMove);
document.addEventListener('touchend', handleEnd);

// Sound button toggle
let soundEnabled = true;
soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    
    if (soundEnabled && gameStarted) {
        playAudioSequence();
    }
});

// Initialize
initClock();
