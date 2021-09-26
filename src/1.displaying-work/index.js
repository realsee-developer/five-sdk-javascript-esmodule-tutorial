import { Five, parseWork } from "@realsee/five";

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

export {};