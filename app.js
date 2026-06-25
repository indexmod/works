const API = "/works.json"; // или Cloudflare Worker URL

console.log("APP START");

async function load() {

    const res = await fetch(API);
    const data = await res.json();

    console.log("DATA:", data);

    const root = document.getElementById("list");

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

}

load();
