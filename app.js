const API = "https://works.wiki-self.workers.dev";

console.log("APP START");

async function load() {

    try {

        const res = await fetch(API);

        const text = await res.text();
        console.log("RAW:", text.slice(0, 200));

        const data = JSON.parse(text);

        console.log("DATA:", data);

        const root = document.getElementById("list");

        if (!root) {
            console.error("NO #list FOUND");
            return;
        }

        root.innerHTML = data.map(item => `

            <div class="item">

                <div class="text">

                    <div class="title">${item.title || ""}</div>

                    <div class="meta">
                        ${item.year || ""} · ${item.size || ""}
                    </div>

                    <div class="meta">
                        ${item.materials || ""}
                    </div>

                    <div class="desc">
                        ${item.desc || ""}
                    </div>

                </div>

                <div class="image">
                    <img src="images/${item.image}.jpg" alt="">
                </div>

            </div>

        `).join("");

    } catch (e) {
        console.error("LOAD ERROR:", e);
    }
}

load();
