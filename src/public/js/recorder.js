const recordBtn = document.getElementById("recordBtn");
const preview = document.querySelector("#preview");

let myStream;
let mediaRecorder;
let videoUrl;

function handleDownload(){
    recordBtn.removeEventListener("click", handleDownload);
    recordBtn.addEventListener("click", handleRecord);
    recordBtn.textContent = "Start recording"
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "My Recording.webm"
    document.body.appendChild(a);
    a.click();
}

function handleStop(){
    mediaRecorder.stop();
    console.log("Recording stopped")
    recordBtn.textContent = "Download a file"
    recordBtn.removeEventListener("click", handleStop);
    recordBtn.addEventListener("click", handleDownload);
    mediaRecorder.addEventListener("dataavailable", (event)=>{
        videoUrl = URL.createObjectURL(event.data);
        preview.srcObject = null;
        preview.src = videoUrl;
        preview.loop = true;
        preview.play();
    })
}

async function handleRecord(){
    await init();
    mediaRecorder = new MediaRecorder(myStream);
    mediaRecorder.start();
    console.log(mediaRecorder.state)
    console.log("Recording started")
    recordBtn.textContent = "Stop recording"
    recordBtn.removeEventListener("click", handleRecord);
    recordBtn.addEventListener("click", handleStop);
}

async function init(){
    
    myStream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: {min: 1280},
            height: {min: 720},
        },
        audio: true
    });
    preview.srcObject = myStream;
    preview.play();
}

recordBtn.addEventListener("click", handleRecord)