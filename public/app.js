let API = "/api";

async function load() {
    const res = await fetch(API + "/artworks");
    const data = await res.json();
    render(data);
}

function render(items) {
    const table = document.getElementById("catalog");
    table.innerHTML = "";

    items.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>
            <div class="dropzone" data-id="${item.id}" data-type="main">
                <img src="${item.image}">
            </div>
        </td>

        <td>
            <div class="dropzone" data-id="${item.id}" data-type="detail">
                <img src="${item.detail_image}">
            </div>
        </td>

        <td contenteditable="true" data-id="${item.id}">
            <div class="info">
                <div class="title">${item.title}</div>
                <div class="meta">${item.meta}</div>
                <div class="desc">${item.description}</div>
            </div>
        </td>
        `;

        table.appendChild(row);
    });

    enableDnD();
}

function enableDnD() {

    document.querySelectorAll(".dropzone").forEach(zone => {

        zone.ondragover = e => e.preventDefault();

        zone.ondrop = async e => {
            e.preventDefault();

            const file = e.dataTransfer.files[0];
            const id = zone.dataset.id;
            const type = zone.dataset.type;

            const form = new FormData();
            form.append("file", file);
            form.append("id", id);
            form.append("type", type);

            const res = await fetch(API + "/upload", {
                method: "POST",
                body: form
            });

            const data = await res.json();
            zone.querySelector("img").src = data.url;
        };
    });
}

document.getElementById("saveBtn").onclick = async () => {

    const updates = [];

    document.querySelectorAll("[contenteditable]").forEach(el => {
        updates.push({
            id: el.dataset.id,
            html: el.innerHTML
        });
    });

    await fetch(API + "/save", {
        method: "POST",
        body: JSON.stringify(updates)
    });

    alert("saved");
};

load();
