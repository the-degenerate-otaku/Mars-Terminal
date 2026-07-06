
const clockEl = document.getElementById('mission-clock');
const statusEl = document.getElementById('status');

// Perseverance landing (Earth UTC) — sol counter epoch
const LANDING_UTC = Date.UTC(2021, 1, 18, 20, 55, 0);
const MARS_SOL_MS = 88775244; // 1 Mars sol ≈ 24h 39m 35s in ms

function updateClock() {
    const now = new Date();

    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;

    // sol count since landing, for flavor
    const solsElapsed = Math.floor((now.getTime() - LANDING_UTC) / MARS_SOL_MS);
    statusEl.textContent = `SOL ${solsElapsed} // LINK ACTIVE`;
}

updateClock();
setInterval(updateClock, 1000);


const NASA_ENDPOINT =
    'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=DEMO_KEY';

const photoEl = document.getElementById('rover-photo');
const msgEl = document.getElementById('viewport-msg');
const cameraEl = document.getElementById('camera-info');
const solEl = document.getElementById('sol-info');

async function fetchRoverPhoto() {
    // reset to loading state on every attempt
    msgEl.hidden = false;
    photoEl.hidden = true;
    msgEl.textContent = 'ESTABLISHING UPLINK...';
    statusEl.textContent = statusEl.textContent.replace('LINK ACTIVE', 'UPLINK IN PROGRESS');

    try {
        const res = await fetch(NASA_ENDPOINT);

        if (res.status === 429) throw new Error('RATE LIMIT');
        if (!res.ok) throw new Error('BAD RESPONSE');

        const data = await res.json();
        const photo = data.latest_photos?.[0];
        if (!photo) throw new Error('NO SIGNAL');

        photoEl.src = photo.img_src;
        photoEl.hidden = false;
        msgEl.hidden = true;

        cameraEl.textContent = `CAM: ${photo.camera.full_name}`;
        solEl.textContent = `SOL: ${photo.sol}`;
        statusEl.textContent = statusEl.textContent.replace('UPLINK IN PROGRESS', 'LINK ACTIVE');

    } catch (err) {
        const reason = err.message === 'RATE LIMIT'
            ? 'UPLINK THROTTLED — TRY AGAIN LATER'
            : 'SIGNAL LOST — TRANSMISSION FAILED';

        msgEl.textContent = reason;
        msgEl.hidden = false;
        photoEl.hidden = true;
        cameraEl.textContent = 'CAM: ---';
        solEl.textContent = 'SOL: ---';
        statusEl.textContent = statusEl.textContent.replace('UPLINK IN PROGRESS', 'LINK DOWN');
    }
}

fetchRoverPhoto();


document.getElementById('refresh-btn').addEventListener('click', fetchRoverPhoto);