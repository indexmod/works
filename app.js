const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEUsZO7APvo_amXquaTettgvbk8RQ_Yq81diOF36jJvNBIzRjTC6r_quylZ54h6YFKs7qBiUJLvtd7/pub?output=csv";

console.log("APP START");

// ---------------- CSV ----------------

function parseCSV(text) {

    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {

        const cols = line.split(",");
        const obj = {};

        headers.forEach((h, i) => {
            obj[h.trim()] = (cols[i] || "").replaceAll('"', '').trim();
        });

        return obj;
    });
}

// ---------------- LOAD ----------------

async function load() {

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const data = parseCSV(text);

    const table = document.getElementById("catalog");
    table.innerHTML = "";

    data.forEach(item => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <img src="images/${item.image}" />
            </td>

            <td>
                <img src="images/${item.detail_image}" />

                <div class="title editable" contenteditable="true">
                    ${item.title || ""}
                </div>

                <div class="meta editable" contenteditable="true">
                    ${item.meta || ""}
                </div>
            </td>
        `;

        table.appendChild(tr);

        // local edit persistence
        const title = tr.querySelector(".title");
        const meta = tr.querySelector(".meta");

        const key = item.id;

        const savedTitle = localStorage.getItem(key + "_title");
        const savedMeta = localStorage.getItem(key + "_meta");

        if (savedTitle) title.innerText = savedTitle;
        if (savedMeta) meta.innerText = savedMeta;

        title.addEventListener("input", () => {
            localStorage.setItem(key + "_title", title.innerText);
        });

        meta.addEventListener("input", () => {
            localStorage.setItem(key + "_meta", meta.innerText);
        });
    });
}

load();
