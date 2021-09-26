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

{ // === 标记三维坐标 ===
  const list = document.querySelector(".js-marks");
  const switcher = document.querySelector(".js-mark-switch");

  five.on("wantsTapGesture", (raycaster) => {
    if (switcher.checked) {
      const [intersect] = five.model.intersectRaycaster(raycaster);
      if (intersect) {
        const { x, y, z } = intersect.point;
        const p = document.createElement("p");
        p.className = "badge bg-primary d-block m-2";
        list.appendChild(p);
        const span = document.createElement("span");
        span.innerHTML = `x=${x.toFixed(2)} y=${y.toFixed(2)} z=${z.toFixed(2)}`;
        p.appendChild(span);
        const close = document.createElement("i");
        close.className = "bi bi-x-circle ms-2";
        close.addEventListener("click", () => list.removeChild(p), false);
        p.appendChild(close);
      }
      return false;
    }
  });
}

export {};