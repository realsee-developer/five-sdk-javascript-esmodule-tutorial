import { Five, parseWork } from "@realsee/five";

const workURL = "https://vrlab-public.ljcdn.com/release/static/image/release/five/work-sample/4e18246c206ba031abf00ee5028920e1/work.json";

const five = new Five();

five.appendTo(document.querySelector("#app"));

fetch(workURL).then(res => res.json()).then((json) => {
  const work = parseWork(json);
  five.load(work);
});

window.addEventListener("resize", () => five.refresh(), false);

export {};