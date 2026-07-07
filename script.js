
const NASA_KEY = 'hvT3UZcsMwv2t4ofU0RRawteGJydYTSyDnRojdm0';
const clockEl = document.getElementById('mission-clock');
const statusEl = document.getElementById('status');
const infoSectionEl = document.getElementById('info-section');
const titleEl = document.getElementById('photo-title');
const descEl = document.getElementById('photo-desc');

const LANDING_UTC = Date.UTC(2021, 1, 18, 20, 55, 0);
const MARS_SOL_MS = 88775244;

let linkState = 'LINK ACTIVE';
function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;

    const solsElapsed = Math.floor((now.getTime() - LANDING_UTC) / MARS_SOL_MS);
    statusEl.textContent = `SOL ${solsElapsed} // ${linkState}`;
}
updateClock();
setInterval(updateClock, 1000);


const NASA_ENDPOINT =
    'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_KEY}';

const photoEl = document.getElementById('rover-photo');
const msgEl = document.getElementById('viewport-msg');
const cameraEl = document.getElementById('camera-info');
const solEl = document.getElementById('sol-info');

const ROVERS = ['curiosity, perseverance'];
let apodInterval = null;
let apodPhotos = [];
let apodIndex = 0;

function stopApodFallback() {
    if (apodInterval) {
        clearInterval(apodInterval);
        apodInterval = null;
    }
}

async function tryRoverPhoto(rover) {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${NASA_KEY}`;
    const res = await fetch(url);
    if (res.status === 429) throw new Error('RATE LIMIT');
    if (!res.ok) throw new Error('NOT_FOUND');
    const data = await res.json();
    const photo = data.latest_photos?.[0];
    if (!photo) throw new Error('NOT_FOUND');
    return photo;
}

async function fetchRoverPhoto() {
    stopApodFallback();
    msgEl.hidden = false;
    photoEl.hidden = true;
    msgEl.textContent = 'ESTABLISHING UPLINK'
    linkState = 'UPLINK IN PROGRESS'

    for (const rover of ROVERS) {
        try {
            const photo = await tryRoverPhoto(rover);
            photoEl.src = photo.img_src;
            photoEl.hidden = false;
            msgEl.hidden = true;
            cameraEl.textContent = `CAM : ${photo.camera.full_name}`;
            solEl.textContent = `SOL : ${photo.sol}`;
            linkState = 'LINK ACTIVE';


            titleEl.textContent = `MARS ROVER: ${photo.rover.name.toUpperCase()}`;
            descEl.textContent = `This image was captured by the Mars ${photo.rover.name} rover on Martian sol ${photo.sol} (Earth date: ${photo.earth_date}). It was taken using the ${photo.camera.full_name} (${photo.camera.name}).`;
            infoSectionEl.hidden = false;


            return;
        } catch (err) {
            if (err.message === 'RATE_LIMIT') {
                msgEl.textContent = 'UPLINK THROTTLED - TRY AGAIN LATER';
                msgEl.hidden = false;
                photoEl.hidden = true;
                cameraEl.textContent = 'CAM ---';
                solEl.textContent = 'SOL: ---';
                linkState = 'LINK DOWN';
                return;
            }
        }
    }

    startApodFallback();
}


async function startApodFallback() {
    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&count=6&thumbs=true`)
        if (!res.ok) throw new Error('APOD_FAIL');
        const data = await res.json();
        apodPhotos = data.filter(item => item.url || item.thumbnail_url);
        if (!apodPhotos.length) throw new Error('APOD_FAIL');

        apodIndex = 0;
        showApodPhoto();
        linkState = `LINK ACTIVE (DEEP SPACE FEED)`;

        apodInterval = setInterval(() => {

            apodIndex = (apodIndex + 1) % apodPhotos.length;
            showApodPhoto();
        }, 20000);

    } catch (err) {
        msgEl.textContent = 'SIGNAL LOST - TRANSMISSION FAILED';
        msgEl.hidden = false;
        photoEl.hidden = true;
        cameraEl.textContent = 'CAM: ---';
        solEl.textContent = 'SOL ---';
        linkState = 'LINK DOWN';
    }
}

function showApodPhoto() {
    const item = apodPhotos[apodIndex];
    const src = item.media_type === 'image' ? item.url : item.thumbnail_url;

    photoEl.style.transition = 'opacity 1s ease';
    photoEl.style.opacity = 0;

    infoSectionEl.style.opacity = 0;
    infoSectionEl.style.transition = 'opacity 1s ease';

    setTimeout(() => {
        photoEl.src = src;
        photoEl.hidden = false;
        msgEl.hidden = true;
        cameraEl.textContent = 'SRC : DEEP SPACE ARCHIVE';
        solEl.textContent = `DATE: ${item.date}`;


        titleEl.textContent = item.title.toUpperCase();
        descEl.textContent = item.explanation;
        infoSectionEl.hidden = false;

        photoEl.style.opacity = 1;
        infoSectionEl.style.opacity = 1;
    }, 400);
}

fetchRoverPhoto();


document.getElementById('refresh-btn').addEventListener('click', fetchRoverPhoto);