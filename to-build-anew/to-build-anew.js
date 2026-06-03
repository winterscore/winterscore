const tracks = [
  {
    title: "Finale (MIDI mockup)",
    genre: "Orchestral mockup",
    duration: "04:15",
    src: "/assets/audio/Finale%20(MIDI%20mockup).mp3",
  },
  {
    title: "Audio snippet #1 from live reading at Juilliard",
    genre: "Live reading",
    duration: "01:25",
    src: "/assets/audio/Audio%20snippet%20%231%20from%20live%20reading%20at%20Juilliard.wav",
  },
  {
    title: "Audio snippet #2 from live reading at Juilliard",
    genre: "Live reading",
    duration: "00:33",
    src: "/assets/audio/Audio%20snippet%20%232%20from%20live%20reading%20at%20Juilliard.wav",
  },
];

const player = document.querySelector("[data-player]");
const audio = player.querySelector("[data-audio]");
const trackTitle = player.querySelector("[data-track-title]");
const subtitle = player.querySelector("[data-subtitle]");
const seek = player.querySelector("[data-seek]");
const current = player.querySelector("[data-current]");
const duration = player.querySelector("[data-duration]");
const toggle = player.querySelector("[data-toggle]");
const prev = player.querySelector("[data-prev]");
const next = player.querySelector("[data-next]");
const trackList = player.querySelector("[data-track-list]");
const playerStatus = player.querySelector("[data-player-status]");

let activeIndex = 0;
let isSeeking = false;

function formatTime(value) {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTrackLabel(track, isActive = false) {
  return `${track.title}, ${track.genre}${isActive ? ", current track" : ""}`;
}

function updatePlayButtonLabel() {
  const action = audio.paused ? "Play" : "Pause";
  toggle.setAttribute("aria-label", `${action} ${tracks[activeIndex].title}`);
}

function updateSeekAccessibility(timeValue = audio.currentTime) {
  const track = tracks[activeIndex];
  const durationValue = Number.isFinite(audio.duration) ? formatTime(audio.duration) : track.duration;
  seek.setAttribute("aria-label", `Seek ${track.title}`);
  seek.setAttribute("aria-valuetext", `${formatTime(timeValue)} of ${durationValue}`);
}

function updateTrackStates() {
  document.querySelectorAll("[data-track]").forEach((item, itemIndex) => {
    const isActive = itemIndex === activeIndex;
    const button = item.querySelector("[data-track-button]");
    const track = tracks[itemIndex];

    item.classList.toggle("is-active", isActive);
    button.setAttribute("aria-label", getTrackLabel(track, isActive));

    if (isActive) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function playAudio() {
  audio.play().catch(() => {
    playerStatus.textContent = `Audio could not be played. Current track: ${getTrackLabel(tracks[activeIndex])}.`;
  });
}

function setProgress(value) {
  player.style.setProperty("--progress", `${value}%`);
}

function setActiveTrack(index, shouldPlay = false) {
  activeIndex = (index + tracks.length) % tracks.length;
  const track = tracks[activeIndex];

  audio.src = track.src;
  trackTitle.textContent = track.title;
  subtitle.textContent = track.genre;
  duration.textContent = track.duration;
  current.textContent = "00:00";
  seek.value = 0;
  setProgress(0);
  updateTrackStates();
  updatePlayButtonLabel();
  updateSeekAccessibility(0);
  playerStatus.textContent = `Current track: ${getTrackLabel(track)}.`;

  if (shouldPlay) {
    playAudio();
  }
}

function renderTracks() {
  trackList.innerHTML = tracks
    .map(
      (track, index) => `
        <li data-track>
          <span class="number">${index + 1}</span>
          <button type="button" data-track-button="${index}" aria-label="${getTrackLabel(track)}">
            <span class="track-title">${track.title}</span>
            <span class="track-genre">${track.genre}</span>
          </button>
          <span class="duration">${track.duration}</span>
        </li>
      `,
    )
    .join("");
}

renderTracks();
setActiveTrack(0);

trackList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-track-button]");
  if (!button) return;
  setActiveTrack(Number(button.dataset.trackButton), true);
});

toggle.addEventListener("click", () => {
  if (audio.paused) {
    playAudio();
  } else {
    audio.pause();
  }
});

prev.addEventListener("click", () => {
  setActiveTrack(activeIndex - 1, true);
});

next.addEventListener("click", () => {
  setActiveTrack(activeIndex + 1, true);
});

audio.addEventListener("play", () => {
  toggle.classList.add("is-playing");
  updatePlayButtonLabel();
  playerStatus.textContent = `Playing ${getTrackLabel(tracks[activeIndex])}.`;
});

audio.addEventListener("pause", () => {
  toggle.classList.remove("is-playing");
  updatePlayButtonLabel();
  playerStatus.textContent = `Paused ${getTrackLabel(tracks[activeIndex])}.`;
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
  updateSeekAccessibility(audio.currentTime);
});

audio.addEventListener("timeupdate", () => {
  if (isSeeking || !Number.isFinite(audio.duration)) return;
  const progress = (audio.currentTime / audio.duration) * 100;
  seek.value = progress;
  setProgress(progress);
  current.textContent = formatTime(audio.currentTime);
  updateSeekAccessibility(audio.currentTime);
});

audio.addEventListener("ended", () => {
  setActiveTrack(activeIndex + 1, true);
});

seek.addEventListener("input", () => {
  isSeeking = true;
  const progress = Number(seek.value);
  const previewTime = Number.isFinite(audio.duration) ? (progress / 100) * audio.duration : 0;
  setProgress(progress);
  current.textContent = formatTime(previewTime);
  updateSeekAccessibility(previewTime);
});

seek.addEventListener("change", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(seek.value) / 100) * audio.duration;
  }
  isSeeking = false;
});
