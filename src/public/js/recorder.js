import { FFmpeg } from "@ffmpeg/ffmpeg";
import {fetchFile} from "@ffmpeg/util";
const recordBtn = document.getElementById("recordBtn");
const preview = document.querySelector("#preview");
const message = document.querySelector("#message");

let myStream;
let mediaRecorder;
let videoUrl;

function downloadFile(fileUrl, filename){
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = filename
    document.body.appendChild(a);
    a.click();
}

const file = {
    input: "input.webm",
    output: 'output.mp4',
    thumbnail: "My thumbnail.jpg",
}

async function handleDownload(){
    recordBtn.removeEventListener("click", handleDownload);
    recordBtn.textContent = "Transcoding..."
    recordBtn.disabled = true;
    const ffmpeg = new FFmpeg();
    console.log(ffmpeg);
    ffmpeg.on("log", ({message})=>{
        console.log(message);
    })
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
    })
    await ffmpeg.writeFile(file.input, await fetchFile(videoUrl));
    recordBtn.textContent = "Start trimming...";
    await ffmpeg.exec(['-i', file.input, '-r', '60', file.output])
    recordBtn.textContent = "Complete trimming";
    await ffmpeg.exec(["-i", file.input, "-ss", "00:00:01", "-frames:v", "1", file.thumbnail]);
    const data = await ffmpeg.readFile(file.output);
    const thumbData = await ffmpeg.readFile(file.thumbnail);
    const mp4Url = URL.createObjectURL(new Blob([data.buffer], {type: "video/mp4"}));
    downloadFile(mp4Url, "My recording.mp4")
    const thumbUrl = URL.createObjectURL(new Blob([thumbData.buffer], {type: "image/jpg"}));
    downloadFile(thumbUrl,"My thumbnail.jpg");
    recordBtn.disabled = false;
    recordBtn.textContent = "Record again";
    recordBtn.addEventListener("click", handleRecord);

    await ffmpeg.deleteFile(file.input);
    await ffmpeg.deleteFile(file.output);
    await ffmpeg.deleteFile(file.thumbnail);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoUrl);
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
    recordBtn.removeEventListener("click", init);
    recordBtn.addEventListener("click", handleRecord);
    recordBtn.textContent = "Start recording"
}

recordBtn.addEventListener("click", init)