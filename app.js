const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEUsZO7APvo_amXquaTettgvbk8RQ_Yq81diOF36jJvNBIzRjTC6r_quylZ54h6YFKs7qBiUJLvtd7/pub?output=csv";

console.log("APP START");

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

async function load() {

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    console.log("RAW:", text.slice(0, 200));

    const data = parseCSV(text);

    console.log("PARSED:", data);

    const table = document.getElementById("catalog");

    table.innerHTML = "";

    data.forEach(item => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <img src="images/${item.image}">
            </td>

            <td>
                <img src="images/${item.detail_image}">
            </td>

            <td>
                <div class="title">${item.title || ""}</div>
                <div class="meta">${item.year || ""} · ${item.size || ""}</div>
                <div class="meta">${item.materials || ""}</div>
                <div class="desc">${item.description || ""}</div>
            </td>
        `;

        table.appendChild(tr);
    });
}

load();
