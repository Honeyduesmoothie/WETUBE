const video = document.querySelector("video");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const timeline = document.getElementById("timeline");
const volumeControl = document.getElementById("volumeControl");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const controls = document.getElementById("controls");
const commentSection = document.getElementById("commentSection");

let volume = 0.5;
let controlsTimeout = null;
let mouseTimeout = null;
video.volume = volume;
// play button
const playNpause = (e) => {
  if (e.target === videoContainer) {
    return;
  }
  if (video.paused) {
    playVideo();
  } else {
    video.pause();
    playStatus = false;
  }
  playBtn.innerHTML = video.paused
    ? '<i class="fa-solid fa-play"></i>'
    : '<i class="fa-solid fa-pause fa-lg"></i>';
};

async function playVideo() {
  try {
    await video.play();
    playBtn.classList.add("playing");
    playStatus = true;
  } catch (err) {
    console.log(err);
    playBtn.classList.remove("playing");
  }
}

function handleMuteBtn() {
  if (video.muted) {
    video.muted = false;
    volumeControl.value = volume;
  } else {
    video.muted = true;
    volumeControl.value = 0;
  }
  muteBtn.innerHTML = video.muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
}

function handleVolumeControl(event) {
  const {
    target: { value },
  } = event;
  volume = value;
  video.volume = volume;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
}
function handleLMT(e) {
  totalTime.textContent = useISOString(video.duration);
  timeline.max = video.duration;
}

function handleTimeUpdate() {
  currentTime.textContent = useISOString(video.currentTime);
  timeline.value = video.currentTime;
}

let playStatus = false;
const handleTimeline = (event) => {
  video.currentTime = timeline.value;
};

function handleFullScreen() {
  if (document.fullscreenElement) {
    // document.fullscreenElement => returns any element being in fullscreen mode, read-only.
    fullScreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
    document.exitFullscreen();
  } else {
    fullScreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
    videoContainer.requestFullscreen();
  }
  // document.extiFullscreen() vs element.requestFullscreen()
}

function handleMouseMove(e) {
  controls.classList.add("showing");
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (mouseTimeout) {
    clearTimeout(mouseTimeout);
    mouseTimeout = null;
  }
  mouseTimeout = setTimeout(() => {
    controls.classList.remove("showing");
  }, 1000);
}

function handleMouseLeave() {
  controlsTimeout = setTimeout(() => {
    controls.classList.remove("showing");
  }, 1000);
}

function playFaster(event) {
  if (event.target.parentNode.parentNode.parentNode === commentSection) {
    return;
  }
  event.preventDefault();
  if (event.key === " " && event.repeat === true) {
    video.playbackRate = 2.0;
  }
}
function spaceBarPlay(event) {
  if (event.target.parentNode.parentNode.parentNode === commentSection) {
    return;
  }
  if (event.key === " ") {
    playNpause();
    video.playbackRate = 1.0;
  }
}
async function handleEnded() {
  const { id } = videoContainer.dataset;
  await fetch(`/api/videos/${id}/view`, {
    method: "post",
  });
}

playBtn.addEventListener("click", playNpause);
videoContainer.addEventListener("click", playNpause);
window.addEventListener("keydown", playFaster);
window.addEventListener("keyup", spaceBarPlay);
muteBtn.addEventListener("click", handleMuteBtn);
volumeControl.addEventListener("input", handleVolumeControl);
video.addEventListener("loadedmetadata", handleLMT);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimeline);
timeline.addEventListener("mousedown", (event) => {
  playStatus = video.paused ? false : true;
  console.log(playStatus);
  video.pause();
  event.target.addEventListener("mouseup", () => {
    playStatus ? video.play() : video.pause();
  });
});
fullScreen.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

function displayTimer(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minuteValue = minutes.toString().padStart(2, "0");
  const secondValue = seconds.toString().padStart(2, "0");

  return `${minuteValue}:${secondValue}`;
}

function useISOString(time) {
  const seconds = Math.floor(time);
  const ISOString = new Date(seconds * 1000).toISOString();
  console.log(ISOString);
  return ISOString.substring(11, 19);
}

// Likes

const videoLikes = document.getElementById("videoLikes");
const videoLikesCount = document.getElementById("videoLikesCount");
const videoDislikes = document.getElementById("videoDislikes");

async function handleVideoLikes() {
  const { id } = videoContainer.dataset;
  videoLikes.classList.toggle("active-button");
  const response = await fetch(`/api/videos/${id}/likes`, {
    method: "post",
  });
  const json = await response.json();
  videoLikesCount.textContent = json.likes;
}

async function handleDislikes() {
  const { id } = videoContainer.dataset;
  videoDislikes.classList.toggle("active-button");
  const response = await fetch(`/api/videos/${id}/dislikes`, {
    method: "post",
  });
  const json = await response.json();
  videoLikesCount.textContent = json.likes;
}

videoLikes.addEventListener("click", handleVideoLikes);
videoDislikes.addEventListener("click", handleDislikes);
