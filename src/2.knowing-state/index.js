import { Five, parseWork } from "@realsee/five";

const workURL = "https://vrlab-public.ljcdn.com/release/static/image/release/five/work-sample/4e18246c206ba031abf00ee5028920e1/work.json";

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

export {};