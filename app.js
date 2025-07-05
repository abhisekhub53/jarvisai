const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
let isFirstClick = true;

// Load audio files
const audios = {
  intro: new Audio('startup.mp3'),
  greet: {
    morning: new Audio('greet-morning.mp3'),
    afternoon: new Audio('greet-afternoon.mp3'),
    evening: new Audio('greet-evening.mp3'),
  },
  cmdGoogle: new Audio('cmd-google.mp3'),
  cmdYoutube: new Audio('cmd-youtube.mp3'),
  cmdSearch: new Audio('cmd-search.mp3'),
  errorRecog: new Audio('error-recognition.mp3')
};

// Time-based greeting with corresponding audio
function wishMeAudio() {
  const hour = new Date().getHours();
  if (hour < 12) {
    audios.greet.morning.play();
  } else if (hour < 17) {
    audios.greet.afternoon.play();
  } else {
    audios.greet.evening.play();
  }
}

// Loader and main screen fade transition
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const main = document.querySelector('.main');

  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      main.classList.add('visible');
    }, 800); // fade-out transition
  }, 4000); // 4 second loader
});

// Microphone button click handler
btn.addEventListener('click', () => {
  if (isFirstClick) {
    content.textContent = 'Playing intro...';
    audios.intro.play().then(() => {
      audios.intro.onended = () => {
        content.textContent = 'Initialization complete.';
        wishMeAudio();
        isFirstClick = false;
      };
    }).catch(() => {
      // Fallback if intro fails
      wishMeAudio();
      isFirstClick = false;
    });
  } else {
    startRecognition();
  }
});

// Web Speech Recognition initialization
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Start speech recognition
function startRecognition() {
  content.textContent = 'Listening...';
  recognition.start();
}

// When speech is recognized
recognition.onresult = (event) => {
  const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
  content.textContent = transcript;
  handleCommand(transcript);
};

// On error in recognition
recognition.onerror = (event) => {
  content.textContent = `Error: ${event.error}`;
  audios.errorRecog.play();
};

// Handle different voice commands
function handleCommand(message) {
  if (message.includes('open google')) {
    window.open('https://google.com', '_blank');
    audios.cmdGoogle.play();
  } else if (message.includes('open youtube')) {
    window.open('https://youtube.com', '_blank');
    audios.cmdYoutube.play();
  } else if (
    message.includes('what is') ||
    message.includes('who is') ||
    message.includes('what are') ||
    message.includes('search')
  ) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(message), '_blank');
    audios.cmdSearch.play();
  } else {
    // Default fallback to Google search
    window.open('https://www.google.com/search?q=' + encodeURIComponent(message), '_blank');
    audios.cmdSearch.play();
  }
}
