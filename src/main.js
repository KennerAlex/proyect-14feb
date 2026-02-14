/* ============================================
   El Universo de Jenifer - Script Principal
   ============================================ */

let currentSceneIndex = 1;
const totalScenes = 6;

// ---- Fondo de Partículas ----
const canvas = document.getElementById('canvas-aurora');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 130; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            s: Math.random() * 1.5 + 0.5,
            vx: Math.random() * 0.6 - 0.3,
            vy: Math.random() * 0.6 - 0.3,
            o: Math.random(),
            type: Math.random() > 0.8 ? 'heart' : 'circle'
        });
    }
}

function drawHeart(ctx, x, y, size, opacity) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(size / 6, size / 6);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -5, -10, 5, 0, 12);
    ctx.bezierCurveTo(10, 5, 5, -5, 0, 0);
    ctx.fillStyle = `rgba(0, 242, 255, ${opacity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2ff";
    ctx.fill();
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        if (p.type === 'circle') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 255, ${p.o})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#00f2ff";
            ctx.fill();
        } else {
            drawHeart(ctx, p.x, p.y, p.s * 2.5, p.o);
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(draw);
}

// ---- Navegación de Escenas ----
function nextScene() {
    if (currentSceneIndex >= totalScenes) return;
    changeScene(currentSceneIndex + 1);
}

function prevScene() {
    if (currentSceneIndex <= 1) return;
    changeScene(currentSceneIndex - 1);
}

function changeScene(index) {
    const current = document.getElementById(`scene-${currentSceneIndex}`);
    const target = document.getElementById(`scene-${index}`);
    current.classList.remove('active');
    setTimeout(() => {
        currentSceneIndex = index;
        target.classList.add('active');
        updateDots();
        if (index > 2) {
            confetti({ particleCount: 15, spread: 40, origin: { y: 0.8 }, colors: ['#00f2ff', '#0077ff'] });
        }
    }, 300);
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSceneIndex - 1);
    });
}

// ---- Rastro de Luciérnagas y Corazones ----
function createTrail(x, y) {
    const isHeart = Math.random() > 0.7;
    const el = document.createElement('div');
    el.className = 'firefly';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    if (isHeart) {
        el.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--cyan-glow)" style="filter: drop-shadow(0 0 5px var(--cyan-glow))"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    } else {
        el.style.width = '5px';
        el.style.height = '5px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'var(--cyan-glow)';
        el.style.boxShadow = '0 0 10px var(--cyan-glow)';
    }

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
}

window.addEventListener('mousemove', e => createTrail(e.clientX, e.clientY));
window.addEventListener('touchmove', e => createTrail(e.touches[0].clientX, e.touches[0].clientY));

// ---- Sorpresa Final: Flores Azules ----
function finalSurprise(btn) {
    btn.innerHTML = "<span class='text-cyan-400 text-[10px] tracking-widest'>¡MAÑANA SERÁ MÁGICO! ✨</span>";
    const container = document.getElementById('flower-container');
    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.style.position = 'absolute';
            flower.style.left = Math.random() * 100 + '%';
            flower.style.bottom = '-10px';
            flower.style.transition = 'all 2.5s ease-out';
            const size = 40 + Math.random() * 70;
            flower.innerHTML = `<svg width="${size}" height="${size * 2}" viewBox="0 0 100 200" style="filter: drop-shadow(0 0 8px rgba(0, 242, 255, 0.5))"><path d="M50 200 Q${40 + Math.random() * 20} 100 50 20" stroke="#0077ff" stroke-width="1.5" fill="none" opacity="0.6" /><g transform="translate(50,20)">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse rx="18" ry="7" transform="rotate(${a})" fill="rgba(0, 242, 255, 0.5)" /><ellipse rx="12" ry="4" transform="rotate(${a})" fill="rgba(255, 255, 255, 0.3)" />`).join('')}<circle r="4" fill="#fff" /></g></svg>`;
            container.appendChild(flower);
            flower.style.transform = `scale(${0.5 + Math.random()})`;
        }, i * 80);
    }
    confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 }, colors: ['#00f2ff', '#0077ff', '#ffffff'] });
}

// ---- Música de Fondo ----
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const musicPlayer = document.getElementById('music-player');
const musicProgress = document.getElementById('music-progress');
const musicCurrent = document.getElementById('music-current');
const musicDuration = document.getElementById('music-duration');
let musicPlaying = false;

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateMusicUI() {
    if (!bgMusic) return;
    // Reiniciar al llegar a 3 minutos
    if (bgMusic.currentTime >= 180) {
        bgMusic.currentTime = 0;
    }
    musicCurrent.textContent = formatTime(bgMusic.currentTime);
    if (bgMusic.duration) {
        const displayDuration = Math.min(bgMusic.duration, 180);
        musicDuration.textContent = formatTime(displayDuration);
        const pct = (bgMusic.currentTime / displayDuration) * 100;
        musicProgress.style.width = Math.min(pct, 100) + '%';
    }
    if (musicPlaying) requestAnimationFrame(updateMusicUI);
}

function setPlayingState(playing) {
    musicPlaying = playing;
    if (musicBtn) musicBtn.textContent = playing ? '❚❚' : '▶';
    if (musicPlayer) musicPlayer.classList.toggle('is-playing', playing);
    if (playing) updateMusicUI();
}

function toggleMusic() {
    if (!bgMusic) return;
    if (musicPlaying) {
        bgMusic.pause();
        setPlayingState(false);
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => setPlayingState(true)).catch(() => {});
    }
}

// Show duration once metadata loads
if (bgMusic) {
    bgMusic.addEventListener('loadedmetadata', () => {
        musicDuration.textContent = formatTime(bgMusic.duration);
    });
}

// Try to autoplay immediately on load
function tryAutoPlay() {
    if (!bgMusic || musicPlaying) return;
    bgMusic.volume = 0.3;
    bgMusic.play().then(() => {
        setPlayingState(true);
    }).catch(() => {
        // Browser blocked autoplay — will play on any user gesture
    });
}

// Global listener: any interaction starts the music if not already playing
function handleFirstInteraction(e) {
    if (musicPlaying || !bgMusic) return;
    bgMusic.volume = 0.3;
    bgMusic.play().then(() => {
        setPlayingState(true);
    }).catch(() => {});
}

document.addEventListener('click', handleFirstInteraction, true);
document.addEventListener('touchstart', handleFirstInteraction, true);
document.addEventListener('keydown', handleFirstInteraction, true);

// Stop listening once music is confirmed playing
if (bgMusic) {
    bgMusic.addEventListener('playing', function onPlaying() {
        document.removeEventListener('click', handleFirstInteraction, true);
        document.removeEventListener('touchstart', handleFirstInteraction, true);
        document.removeEventListener('keydown', handleFirstInteraction, true);
        bgMusic.removeEventListener('playing', onPlaying);
    });
}

// ---- Init ----
window.onload = () => {
    resize();
    initParticles();
    draw();
    tryAutoPlay();
};
window.onresize = resize;
