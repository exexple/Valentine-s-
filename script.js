const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const playPauseBtn = document.getElementById('playPause');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

const valQuestion = document.getElementById('valentine-question');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

let currentPage = 0;

function showPage(index) {
    pages.forEach((page, i) => {
        page.classList.toggle('active', i === index);
    });
    
    // 🔥 FIX 1: Hide Next button on Valentine page (index 3)
    prevBtn.style.display = index === 0 ? 'none' : 'block';
    if (index === 3) {
        nextBtn.style.display = 'none'; // No Next button!
    } else {
        nextBtn.style.display = 'block';
        nextBtn.textContent = index === pages.length - 1 ? '💕' : 'Next →';
    }

    // 🔥 FIX 2: 2 seconds instead of 3
    if (index === 3) {
        valQuestion.classList.add('hidden');
        setTimeout(() => {
            valQuestion.classList.remove('hidden');
        }, 2000); // Changed from 3000 to 2000
    }
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
});

// 🔥 Prevent Next button on Valentine page
nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1 && currentPage !== 3) {
        currentPage++;
        showPage(currentPage);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1 && currentPage !== 3) {
        currentPage++;
        showPage(currentPage);
    } else if (e.key === ' ' && document.activeElement.tagName !== 'INPUT') {
        if (currentPage === 2 && audio) {
            e.preventDefault();
            togglePlayPause();
        }
    }
});

function togglePlayPause() {
    if (!audio) return;
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    }
}

if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);

if (audio) {
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });
}

if (progress) {
    progress.addEventListener('input', () => {
        const time = (progress.value / 100) * audio.duration;
        audio.currentTime = time;
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Valentine's buttons (UNCHANGED - your working code)
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        currentPage = 4;
        showPage(currentPage);
        launchConfetti();
        
        // 🔥 FIX 3: Auto-play GIF on Yes page
        const loveGif = document.querySelector('.love-gif');
        if (loveGif) {
            loveGif.play(); // Auto-play
        }
    });
}

// 🔥 YOUR WORKING No button code (UNCHANGED)
if (noBtn) {
    noBtn.addEventListener('mouseover', jumpNoButton);
    noBtn.addEventListener('click', jumpNoButton);
}

function jumpNoButton() {
    // Position relative to viewport (entire screen)
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '9999';
    
    // Screen-safe jump positions like your screenshot marks
    const jumpPositions = [
        {left: '10%', top: '10%'},      
        {left: '80%', top: '10%'},      
        {left: '10%', top: '70%'},      
        {left: '80%', top: '70%'},      
        {left: '50%', top: '20%'},      
        {left: '50%', top: '80%'},      
        {left: '20%', top: '50%'},      
        {left: '75%', top: '50%'}       
    ];
    
    const randomPos = jumpPositions[Math.floor(Math.random() * jumpPositions.length)];
    noBtn.style.left = randomPos.left;
    noBtn.style.top = randomPos.top;
    
    // Playful shake + glow effect
    noBtn.style.transform = `scale(1.2) rotate(${Math.random() * 20 - 10}deg)`;
    noBtn.style.boxShadow = '0 0 30px rgba(255, 105, 180, 0.8)';
    
    // Reset shake after bounce
    setTimeout(() => {
        noBtn.style.transform = 'scale(1) rotate(0deg)';
        noBtn.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    }, 300);
}

function launchConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    if (!confettiContainer) return;

    confettiContainer.innerHTML = '';
    const emojis = ['💖','🎉','💕','✨','🥳','💫','💘','🌟'];
    
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        piece.style.position = 'absolute';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.top = '-10vh';
        piece.style.fontSize = (Math.random() * 20 + 10) + 'px';
        piece.style.pointerEvents = 'none';
        piece.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        confettiContainer.appendChild(piece);
    }
}

// Confetti animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(style);

// Init
showPage(0);