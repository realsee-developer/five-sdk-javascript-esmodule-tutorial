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

{ // === 打标签 ===
  const app = document.querySelector("#app");
  const addButton = document.querySelector(".js-add-tag");
  let newTag = null;
  let tags = [];
  const tagToElement = new WeakMap();

  const createTagElement = tag => {
    const div = document.createElement("div");
    div.className = "tag";
    div.style.display = "none";
    div.innerHTML = `<div class="tag-pannel"><span class="tag-content">${tag.label}</span></div>`;
    app.appendChild(div);
    return div;
  };

  const renderTags = () => {
    for (const tag of [newTag, ...tags]) {
      if (!tag) continue;
      if (!tag.position) continue;
      const element = tagToElement.get(tag);
      if (!element) continue;
      const position = five.project2d(tag.position, true);
      if (position === null) {
        element.style.display = "none";
      } else {
        element.style.display = "";
        element.style.left = position.x + "px";
        element.style.top = position.y + "px";
      }
    }
  };

  addButton.addEventListener("click", () => {
    newTag = { label: window.prompt("添加标签", "") || "未命名" };
    tagToElement.set(newTag, createTagElement(newTag));
  }, false);

  five.on("intersectionOnModelUpdate", intersect => {
    if (newTag) newTag.position = intersect.point;
    renderTags();
  });
  five.on("wantsTapGesture", () => {
    if (newTag && newTag.position) {
      tags.push(newTag);
      newTag = null;
      renderTags();
      return false;
    }
  });
  five.on("cameraUpdate", renderTags);
}

export {};