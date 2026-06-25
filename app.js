const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEUsZO7APvo_amXquaTettgvbk8RQ_Yq81diOF36jJvNBIzRjTC6r_quylZ54h6YFKs7qBiUJLvtd7/pub?output=csv";

console.log("APP START");

// -------------------- CSV --------------------

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

// -------------------- IMAGE DROP --------------------

function enableDrop(imgEl, item, key) {

    imgEl.addEventListener("dragover", e => {
        e.preventDefault();
        imgEl.style.opacity = 0.6;
    });

    imgEl.addEventListener("dragleave", () => {
        imgEl.style.opacity = 1;
    });

    imgEl.addEventListener("drop", e => {

        e.preventDefault();
        imgEl.style.opacity = 1;

        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = ev => {

            imgEl.src = ev.target.result;

            // local save
            localStorage.setItem(item.id + "_" + key, ev.target.result);

            // mark dirty for future sync
            console.log("UPDATED:", item.id, key);
        };

        reader.readAsDataURL(file);
    });
}

// -------------------- TEXT EDIT --------------------

function makeEditable(el, item, key) {

    el.contentEditable = true;

    const saved = localStorage.getItem(item.id + "_" + key);
    if (saved) el.innerText = saved;

    el.addEventListener("input", () => {
        localStorage.setItem(item.id + "_" + key, el.innerText);
    });
}

// -------------------- LOAD --------------------

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
                <img class="main-img" src="images/${item.image}">
            </td>

            <td>
                <img class="detail-img" src="images/${item.detail_image}">
            </td>

            <td>
                <div class="title">${item.title || ""}</div>
                <div class="meta">${item.year || ""} · ${item.size || ""}</div>
                <div class="meta">${item.materials || ""}</div>
                <div class="desc">${item.description || ""}</div>
            </td>
        `;

        table.appendChild(tr);

        // ---- hooks ----

        const title = tr.querySelector(".title");
        const meta = tr.querySelector(".meta");
        const desc = tr.querySelector(".desc");

        makeEditable(title, item, "title");
        makeEditable(desc, item, "desc");

        const mainImg = tr.querySelector(".main-img");
        const detailImg = tr.querySelector(".detail-img");

        enableDrop(mainImg, item, "image");
        enableDrop(detailImg, item, "detail_image");

        // restore local images
        const img1 = localStorage.getItem(item.id + "_image");
        const img2 = localStorage.getItem(item.id + "_detail_image");

        if (img1) mainImg.src = img1;
        if (img2) detailImg.src = img2;
    });
}

function setMode(mode) {

    if (mode === "print") {
        document.body.classList.add("print-mode");
    } else {
        document.body.classList.remove("print-mode");
    }
}

load();
