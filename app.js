const API = "https://works.wiki-self.workers.dev";

console.log("START");

async function load() {

  const res = await fetch(API);
  const data = await res.json();

  const root = document.getElementById("list");

  root.innerHTML = data.map(w => `

    <div class="item">

      <div class="text">
        <div>${w.title || ""}</div>
        <div>${w.year || ""}</div>
        <div>${w.size || ""}</div>
        <div>${w.materials || ""}</div>
        <div>${w.desc || ""}</div>
      </div>

      <img src="images/${w.image || ""}.jpg">

    </div>

  `).join("");

}

load();
