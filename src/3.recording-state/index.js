import { Five, parseWork } from "@realsee/five";
import { Recorder } from "./recorder";

const workURL = "https://vrlab-public.ljcdn.com/release/static/image/release/five/work-sample/07bdc58f413bc5494f05c7cbb5cbdce4/work.json";

const five = new Five();

five.appendTo(document.querySelector("#app"));

fetch(workURL).then(res => res.json()).then((json) => {
  const work = parseWork(json);
  five.load(work);
});

window.addEventListener("resize", () => five.refresh(), false);

{// === 模式切换 ===
  const buttons = {
    "Panorama": document.querySelector(".js-Panorama"),
    "Floorplan": document.querySelector(".js-Floorplan")
  };

  for (const [modeName, element] of Object.entries(buttons)) {
    element.addEventListener("click", () => {
      five.setState({ mode: modeName });
    }, false);
  }

  five.on("stateChange", state => {
    for (const [modeName, element] of Object.entries(buttons)) {
      if (modeName === state.mode) {
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    };
  });
}

{ // === 环视 ===
  let timer;
  const startButton = document.querySelector(".js-lookAround-start");
  const stopButton = document.querySelector(".js-lookAround-stop");
  startButton.addEventListener("click", () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      five.setState({ longitude: five.state.longitude + Math.PI / 360 })
    }, 16);
    startButton.classList.add("d-none");
    stopButton.classList.remove("d-none");
  }, false);
  stopButton.addEventListener("click", () => {
    window.clearInterval(timer);
    startButton.classList.remove("d-none");
    stopButton.classList.add("d-none");
  }, false);
}

{ //=== 录制 ===
  const recorder = new Recorder();
  const startRecordingButton = document.querySelector(".js-recording-start");
  const stopRecordingButton = document.querySelector(".js-recording-stop");
  const playRecordingButton = document.querySelector(".js-recording-play");
  const recordingState = document.querySelector(".js-state-recording");
  const playingState = document.querySelector(".js-state-playing");

  five.on("stateChange", state => {
    if (recordingState.classList.contains("d-none")) return;
    recorder.record(state);
  });

  startRecordingButton.addEventListener("click", () => {
    recorder.startRecording();
    startRecordingButton.classList.add("d-none");
    stopRecordingButton.classList.remove("d-none");
    playRecordingButton.classList.add("d-none");
    recordingState.classList.remove("d-none");
    playingState.classList.add("d-none");
  }, false);

  stopRecordingButton.addEventListener("click", () => {
    recorder.endRecording();
    startRecordingButton.classList.remove("d-none");
    stopRecordingButton.classList.add("d-none");
    playRecordingButton.classList.remove("d-none");
    recordingState.classList.add("d-none");
    playingState.classList.add("d-none");
  }, false);

  playRecordingButton.addEventListener("click", () => {
    const hasReocrd = recorder.play((state, isFinal) => {
      five.setState(state);
      if (isFinal) {
        startRecordingButton.classList.remove("d-none");
        stopRecordingButton.classList.add("d-none");
        playRecordingButton.classList.remove("d-none");
        recordingState.classList.add("d-none");
        playingState.classList.add("d-none");
      }
    });
    if (hasReocrd) {
      startRecordingButton.classList.add("d-none");
      stopRecordingButton.classList.add("d-none");
      playRecordingButton.classList.add("d-none");
      recordingState.classList.add("d-none");
      playingState.classList.remove("d-none");
    }
  }, false);
}

export {};