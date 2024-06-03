const video = document.querySelector("video");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const timeline = document.getElementById("timeline");
const volumeControl = document.getElementById("volumeControl");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");


let volume = 0.5;
video.volume = volume;
// play button
const handlePlayBtn = (e) =>{
    if(video.paused){
        playVideo();
    } else {
        video.pause();
    }
    playBtn.textContent = video.paused? "Play" : "Pause"
}

async function playVideo() {
    try {
      await video.play();
      playBtn.classList.add("playing");
    } catch (err) {
        console.log(err)
      playBtn.classList.remove("playing");
    }
  }

function handleMuteBtn(){
    if(video.muted){
        video.muted = false;
        volumeControl.value = volume;
    } else {
        video.muted = true;
        volumeControl.value = 0;
    }
    muteBtn.textContent = video.muted? "Unmute":"Mute";
}

function handleVolumeControl(event){
    const {target:{value}} = event;
    volume = value;
    video.volume = volume;
    if(video.muted) {
        video.muted = false;
        muteBtn.textContent = "Mute";
    }
}
function handleLMT(e){
    totalTime.textContent = useISOString(video.duration);
}

function handleTimeUpdate(){
    currentTime.textContent = useISOString(video.currentTime);
}

playBtn.addEventListener("click", handlePlayBtn)
muteBtn.addEventListener("click", handleMuteBtn)
volumeControl.addEventListener("input", handleVolumeControl)
video.addEventListener("loadedmetadata", handleLMT);
video.addEventListener("timeupdate", handleTimeUpdate)

function displayTimer (time){
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time%60);

    const minuteValue = minutes.toString().padStart(2,"0");
    const secondValue = seconds.toString().padStart(2,"0");

    return `${minuteValue}:${secondValue}`;
}

function useISOString(time) {
    const seconds = Math.floor(time)
    const ISOString = new Date(seconds*1000).toISOString();
    console.log(ISOString);
    return ISOString.substring(11,19);
}