const tracks = [
  {
    title: "A Quiet Goodbye",
    genre: "Thriller/Horror",
    duration: "01:30",
    src: "assets/audio/quiet-goodbye.wav",
  },
  {
    title: "No Escape",
    genre: "Thriller/Horror",
    duration: "02:25",
    src: "assets/audio/no-escape.wav",
  },
  {
    title: "Overture",
    genre: "Classic Hollywood",
    duration: "01:11",
    src: "assets/audio/classic-hollywood-overture.wav",
  },
  {
    title: "Playful Seduction",
    genre: "Romantic Comedy",
    duration: "01:49",
    src: "assets/audio/playful-seduction.wav",
  },
  {
    title: "Relentless Pursuit",
    genre: "Action/Adventure",
    duration: "00:28",
    src: "assets/audio/relentless-pursuit.wav",
  },
];

const player = document.querySelector("[data-player]");
const audio = player.querySelector("[data-audio]");
const title = document.querySelector("#music-title");
const trackTitle = player.querySelector("[data-track-title]");
const subtitle = player.querySelector("[data-subtitle]");
const seek = player.querySelector("[data-seek]");
const current = player.querySelector("[data-current]");
const duration = player.querySelector("[data-duration]");
const toggle = player.querySelector("[data-toggle]");
const prev = player.querySelector("[data-prev]");
const next = player.querySelector("[data-next]");
const trackList = player.querySelector("[data-track-list]");

let activeIndex = 0;
let isSeeking = false;

function formatTime(value) {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function setActiveTrack(index, shouldPlay = false) {
  activeIndex = (index + tracks.length) % tracks.length;
  const track = tracks[activeIndex];

  audio.src = track.src;
  title.textContent = "Cinematic Excerpts";
  trackTitle.textContent = track.title;
  subtitle.textContent = track.genre;
  duration.textContent = track.duration;
  current.textContent = "00:00";
  seek.value = 0;
  setProgress(0);

  document.querySelectorAll("[data-track]").forEach((item, itemIndex) => {
    item.classList.toggle("is-active", itemIndex === activeIndex);
  });

  if (shouldPlay) {
    audio.play();
  }
}

function setProgress(value) {
  player.style.setProperty("--progress", `${value}%`);
}

function renderTracks() {
  trackList.innerHTML = tracks
    .map(
      (track, index) => `
        <li data-track>
          <span class="number">${index + 1}</span>
          <button type="button" data-track-button="${index}" aria-label="${track.title}, ${track.genre}">
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

const credits = document.querySelector(".credits");
const creditsToggle = document.querySelector("[data-credits-toggle]");

creditsToggle?.addEventListener("click", () => {
  const isExpanded = credits.classList.toggle("is-expanded");
  creditsToggle.textContent = isExpanded ? "Show Fewer Credits" : "Show More Credits";
  creditsToggle.setAttribute("aria-expanded", String(isExpanded));
});

toggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
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
  toggle.setAttribute("aria-label", "Pause current track");
});

audio.addEventListener("pause", () => {
  toggle.classList.remove("is-playing");
  toggle.setAttribute("aria-label", "Play current track");
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (isSeeking || !Number.isFinite(audio.duration)) return;
  const progress = (audio.currentTime / audio.duration) * 100;
  seek.value = progress;
  setProgress(progress);
  current.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  setActiveTrack(activeIndex + 1, true);
});

seek.addEventListener("input", () => {
  isSeeking = true;
  const progress = Number(seek.value);
  const previewTime = (progress / 100) * audio.duration;
  setProgress(progress);
  current.textContent = formatTime(previewTime);
});

seek.addEventListener("change", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(seek.value) / 100) * audio.duration;
  }
  isSeeking = false;
});
