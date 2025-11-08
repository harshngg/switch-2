
 const body = document.body;

    // Array of background images
    const themes = ['download.jpg', 'GardenofWords.gif','PixelJeffXDivoom-PixelJeff.gif'];
    let themeIndex = 0;

    // Single music track
    const musicTrack = 'clocktown.mp3';
    let audio = null;

    // Music state: 0 = not started, 1 = playing, 2 = stopped
    let musicState = 0;

    // Change theme background
    function changeTheme() {
      themeIndex = (themeIndex + 1) % themes.length;
      body.style.backgroundImage = `url('${themes[themeIndex]}')`;
    }

    // Toggle music with 3-state logic
    function toggleMusic() {
      if (!audio) {
        audio = new Audio(musicTrack);
        audio.loop = true;
      }

      if (musicState === 0) {
        // First click: start music
        audio.currentTime = 0;
        audio.play();
        audio.volume=0.10;
        musicState = 1;
      } else if (musicState === 1) {
        // Second click: pause music
        audio.pause();
        musicState = 2;
      } else if (musicState === 2) {
        // Third click: restart music from beginning
        audio.currentTime = 0;
        audio.play();
        audio.volume=0.10;
        musicState = 1;
      }
    }

    // Initialize first background
    body.style.backgroundImage = `url('${themes[themeIndex]}')`;
    /*test 01*/
    


// const colors = {
//   work: 'black',
//   about: 'blue',
//   mail: 'green',
//   goal: 'orange'
// };

const popupSettings = {
  Zelda: {
    width: 700,
    height: 500,
    top: 60,
    left: 80,
    background: 'rgba(128,128,128,0.6)',
    headerBackground: '#222',
    headerFilter: 'saturate(1.2) brightness(1)',
    contentFilter: 'saturate(1) brightness(1)',
    popupFilter: 'contrast(1.1)',
    backdropFilter: 'blur(5px) saturate(10%)',
    content: document.getElementById('popup-Zelda').innerHTML
  },
  about: {
    width: 700,
    height: 400,
    top: 100,
    left: 200,
    background: 'rgba(236, 228, 228, 0.54)',
    headerBackground: 'rgba(41, 39, 39, 0.33)',
    headerFilter: 'saturate(1) brightness(1.1)',
    contentFilter: 'brightness(0.9)',
    popupFilter: '',
    backdropFilter: 'blur(0px) saturate(300%)',
    content: document.getElementById('popup-about').innerHTML
  },
  mail: {
    width: 400,
    height: 600,
    top: 150,
    left: 150,
    background: 'rgba(255, 255, 255, 0.03)',
    headerBackground: 'rgba(255, 255, 255, 0.03)',
    headerFilter: 'saturate(0%) brightness(0.9) contrast(1.1)',
    contentFilter: '',
    popupFilter: '',
    backdropFilter: 'blur(0px) saturate(400%)',
    content: document.getElementById('popup-mail').innerHTML
  },
  goal: {
    width: 450,
    height: 400,
    top: 80,
    left: 100,
    background: 'rgba(255,165,0,0.5)',
    headerBackground: '#cc6600',
    headerFilter: 'saturate(1.5) brightness(1.2)',
    contentFilter: 'contrast(1.2)',
    popupFilter: '',
    backdropFilter: 'blur(4px) saturate(140%)',
    content: document.getElementById('popup-goal').innerHTML
  }
};


let currentZ = 1;

// Helper to clamp popup inside viewport
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Draggable behavior
function makeDraggable(el) {
  const header = el.querySelector('.popup-header');
  let posX = 0, posY = 0, startX = 0, startY = 0;

  header.onmousedown = function(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;

    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  };

  function drag(e) {
    e.preventDefault();
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    let newTop = el.offsetTop + posY;
    let newLeft = el.offsetLeft + posX;

    const popupHeight = el.offsetHeight;
    const popupWidth = el.offsetWidth;

    newTop = clamp(newTop, 0, window.innerHeight - popupHeight);
    newLeft = clamp(newLeft, 0, window.innerWidth - popupWidth);

    el.style.top = newTop + 'px';
    el.style.left = newLeft + 'px';
  }

  function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function bringToFront(el) {
  currentZ++;
  el.style.zIndex = currentZ;
}

// Button logic
document.querySelectorAll('.actionButtons').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    const settings = popupSettings[type] || {};

    // If popup exists, bring to front
    let existing = document.querySelector(`.popup[data-type="${type}"]`);
    if (existing) {
      bringToFront(existing);
      return;
    }

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.dataset.type = type;
    
    popup.style.width = (settings.width || 400) + 'px';
    popup.style.height = (settings.height || 300) + 'px';
    popup.style.background = settings.background || colors[type] || 'gray';
    popup.style.top = (settings.top || 50) + 'px';
    popup.style.left = (settings.left || 50) + 'px';
    popup.style.position = 'absolute';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';

    // Apply popup-wide filters
    if (settings.popupFilter) popup.style.filter = settings.popupFilter;
    if (settings.backdropFilter) {
      popup.style.backdropFilter = settings.backdropFilter;       // <-- Backdrop filter
      popup.style.WebkitBackdropFilter = settings.backdropFilter; // <-- Safari support
    }

    const headerBg = settings.headerBackground || '#333';
    const headerFilter = settings.headerFilter || 'none';
    const contentFilter = settings.contentFilter || 'none';

    popup.innerHTML = `
      <div class="popup-header" style="
          padding:10px; 
          background:${headerBg}; 
          filter:${headerFilter};     /* Header filter */
          color:white; 
          cursor:default; 
          display:flex; 
          justify-content:space-between; 
          align-items:center;
      ">
        <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span class="close-btn" style="cursor:pointer; font-size:20px;">&times;</span>
      </div>
      <div class="popup-content" style="
          padding:20px; 
          color:black; 
          font-size:120%;
          overflow:auto; 
          filter:${contentFilter};     /* Content filter */
      ">
        ${settings.content}
      </div>
    `;
    //  || `<p>This is the <strong>${type}</strong> popup window.</p>`

    document.body.appendChild(popup);
    makeDraggable(popup);
    bringToFront(popup);

    popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());
    popup.addEventListener('mousedown', () => bringToFront(popup));
  });
});
const clicksound = document.getElementById("clicksound");

document.querySelectorAll("#play-btn").foreach(btn=>{
  btn.addEventListener("click",()=>{
  clicksound.currentTime = 0;
  clicksound.play( );
});

});
function star(){


}
