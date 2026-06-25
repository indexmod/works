const API = "https://your-worker.workers.dev?view=grid";

async function load() {

  const res = await fetch(API);
  const data = await res.json();

  const root = document.getElementById("list");

  if (data.view === "grid") renderGrid(data.works);
  if (data.view === "list") renderList(data.works);
  if (data.view === "print") renderPrint(data.works);
}

function renderGrid(works) {

  document.body.className = "grid";

  list.innerHTML = works.map(w => `
    <div class="item">
      <img src="images/${w.image}">
      <div class="title">${w.title}</div>
    </div>
  `).join("");
}

function renderList(works) {

  document.body.className = "list";

  list.innerHTML = works.map(w => `
    <div class="row">
      <div>${w.title}</div>
      <div>${w.year}</div>
    </div>
  `).join("");
}

function renderPrint(works) {

  document.body.className = "print";

  list.innerHTML = works.map(w => `
    <div class="print-item">
      <img src="images/${w.image}">
      <div>${w.title} · ${w.year}</div>
    </div>
  `).join("");
}

load();
