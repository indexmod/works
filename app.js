const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEUsZO7APvo_amXquaTettgvbk8RQ_Yq81diOF36jJvNBIzRjTC6r_quylZ54h6YFKs7qBiUJLvtd7/pub?output=csv";

const SYNC_URL = "/api/sync"; // будущий worker

console.log("APP START");

// ---------- CSV ----------

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

// ---------- SYNC QUEUE ----------

const pendingSync = new Map();

function scheduleSync(id, meta) {

    pendingSync.set(id, meta);

    // debounce batch sync
    clearTimeout(window.__syncTimer);

    window.__syncTimer = setTimeout(() => {

        const payload = Array.from(pendingSync.entries()).map(([id, meta]) => ({
            id,
            meta
        }));

        pendingSync.clear();

        fetch(SYNC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("SYNC SENT:", payload);

    }, 800);
}

// ---------- LOAD ----------

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
                <img src="images/${item.image}">
            </td>

            <td>
                <div class="meta editable" contenteditable="true">${item.meta || ""}</div>
            </td>
        `;

        const metaEl = tr.querySelector(".meta");

        // restore local cache first (instant UX)
        const saved = localStorage.getItem(item.id + "_meta");
        if (saved) metaEl.innerText = saved;

        // edit handler
        metaEl.addEventListener("input", () => {

            const value = metaEl.innerText;

            // local cache
            localStorage.setItem(item.id + "_meta", value);

            // server sync
            scheduleSync(item.id, value);
        });

        table.appendChild(tr);
    });
}

load();
