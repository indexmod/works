async function load() {
  const res = await fetch('/api/works');
  const data = await res.json();

  console.log(data);

  document.getElementById('list').innerHTML =
    data.map(i => `
      <div class="item">
        <div class="text">
          <div>${i.title}</div>
          <div>${i.year} · ${i.size}</div>
          <div>${i.materials}</div>
        </div>

        <img src="${i.image}">
      </div>
    `).join('');
}

load();
