function updateTime() {
  let now = new Date();

  let parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Pacific/Honolulu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  let get = (type) => parts.find((p) => p.type === type).value;

  let isoHST =
    `${get("year")}-${get("month")}-${get("day")}T` +
    `${get("hour")}:${get("minute")}:${get("second")}-10:00`;

  document.querySelector(".time").textContent = isoHST;
}

updateTime();
setInterval(updateTime, 1000);

// Create apps
let apps = [
  {
    name: "aboutme.html",
    image:
      "https://www.firefox.com/media/img/firefox/releasenotes/firefox-developer-logo.53cbb9bbe54d.svg",
    src: "https://ethan-codes.com"
  },
];
let appObjects = [];
for (const i of apps) {
  let c = document.createElement("div");
  c.classList.add("icon");
  c.innerHTML = `
    <img class="icon-img" src="${i.image}">
    <span>${i.name}</span>
  `;
  document.querySelector(".desktop").appendChild(c);
  appObjects.push(c);
}

// Application icon effects
for (const c of appObjects) {
  c.addEventListener("click", function (e) {
    e.stopPropagation();
    for (const other of appObjects) {
      other.classList.remove("selected");
    }
    c.classList.add("selected");
  });

  c.addEventListener("dblclick", function () {
    const app = apps[appObjects.indexOf(c)];
    const template = document.getElementById("window-template");
    const win = template.cloneNode(true);
    win.removeAttribute("id");
    win.style.display = "";
    win.querySelector(".window-title").textContent = app.name;
    win.querySelector(".window-frame").src = app.src;
    win.querySelector(".window-close").addEventListener("click", function () {
      win.remove();
    });
    makeWindowInteractive(win);
    document.body.appendChild(win);
  });
}

document.querySelector(".desktop").addEventListener("click", function (e) {
  for (const other of appObjects) {
    other.classList.remove("selected");
  }
});


let highestZ = 600;

function makeWindowInteractive(win) {
  const bar = win.querySelector(".window-bar");

  // Focus / z-index stacking
  win.addEventListener("mousedown", function () {
    highestZ++;
    win.style.zIndex = highestZ;
  });

  // Dragging
  let isDragging = false;
  let offsetX, offsetY;

  const frame = win.querySelector(".window-frame");

  bar.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    frame.style.pointerEvents = "none";
    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    frame.style.pointerEvents = "";
  });
}