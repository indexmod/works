const DATA = [
{
    title: "Хор 002",
    year: 2026,
    size: "120 × 60 см",
    materials: "Фанера, белая эмаль, чёрный маркер",
    image: "images/hor-002.jpg",
    desc: "Композиция построена в виде сетки 8 × 4."
},
{
    title: "Хор 003",
    year: 2026,
    size: "120 × 60 см",
    materials: "Фанера, белая эмаль, чёрный маркер",
    image: "images/hor-003.jpg",
    desc: "Многосоставная композиция из большого количества лиц."
}
];

function render() {

    const root = document.getElementById("list");

    root.innerHTML = DATA.map(item => `
        <div class="item">

            <div class="text">
                <div class="title">${item.title}</div>
                <div class="meta">${item.year} · ${item.size}</div>
                <div class="meta">${item.materials}</div>
                <div class="desc">${item.desc}</div>
            </div>

            <div class="image">
                <img src="${item.image}">
            </div>

        </div>
    `).join("");

}

render();
