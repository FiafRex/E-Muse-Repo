const players = [];
let currentTrackIndex = 0;
let isPlaying = false;

function initPlayer(index, iframe) {
  const player = SC.Widget(iframe);
  players.push(player);

  player.bind(SC.Widget.Events.READY, function() {
    player.bind(SC.Widget.Events.PLAY, () => {
      currentTrackIndex = index;
      updatePlayerUI();
    });

    player.bind(SC.Widget.Events.PAUSE, () => {
      updatePlayerUI();
    });

    player.bind(SC.Widget.Events.FINISH, () => {
      nextTrack();
    });
  });
}

const iframes = document.querySelectorAll('iframe');
iframes.forEach((iframe, index) => {
  initPlayer(index, iframe);
});

function playTrack() {
  players[currentTrackIndex].play();
  isPlaying = true;
  updatePlayerUI();
}

function pauseTrack() {
  players[currentTrackIndex].pause();
  isPlaying = false;
  updatePlayerUI();
}

function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % players.length;
  playTrack();
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + players.length) % players.length;
  playTrack();
}

function updatePlayerUI() {
  const currentPlayer = players[currentTrackIndex];

  currentPlayer.getCurrentSound((sound) => {
    const trackInfo = document.querySelector('.track-info');
    trackInfo.innerHTML = `<a href="${sound.user.permalink_url}" target="_blank" style="color: #cccccc; text-decoration: none;">${sound.user.username}</a> · <a href="${sound.permalink_url}" target="_blank" style="color: #cccccc; text-decoration: none;">${sound.title}</a>`;
  });

  currentPlayer.isPaused((paused) => {
    const playPauseButton = document.getElementById('playPauseButton');
    const icon = playPauseButton.querySelector('i');

    if (paused) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    } else {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
    }
  });
}

function changeVolume(volume) {
  const vol = parseInt(volume) / 5;
  players[currentTrackIndex].setVolume(vol);
}

const playPauseButton = document.getElementById('playPauseButton');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
const volumeControl = document.getElementById('volumeControl');

nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);
playPauseButton.addEventListener('click', togglePlayPause);
volumeControl.addEventListener('input', (e) => changeVolume(e.target.value));

playTrack();