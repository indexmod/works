export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/works") {
      return Response.json([
        {
          title: "Хор 002",
          year: 2026,
          size: "120 × 60 см",
          materials: "Фанера, эмаль",
          image: "images/hor-002.jpg"
        },
        {
          title: "Фас 001",
          year: 2026,
          size: "69 × 73 см",
          materials: "Холст",
          image: "images/fas-001.jpg"
        }
      ]);
    }

    return new Response(indexHTML(), {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};

function indexHTML() {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Works</title>

<style>
body {
  margin:0;
  padding:20mm;
  font-family: Helvetica;
  background:#fff;
  color:#000;
}

.list { display:flex; flex-direction:column; gap:18mm; }

.item {
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:12mm;
}

.text { flex:1; }

.image { width:80mm; }

.image img { width:100%; height:auto; display:block; }

.title { font-size:20px; margin-bottom:6px; }
.meta { font-size:14px; margin-bottom:4px; }
</style>
</head>

<body>
<div class="list" id="list"></div>

<script>
async function load() {
  const res = await fetch('/api/works');
  const data = await res.json();

  document.getElementById('list').innerHTML =
    data.map(i => \`
      <div class="item">
        <div class="text">
          <div class="title">\${i.title}</div>
          <div class="meta">\${i.year} · \${i.size}</div>
          <div class="meta">\${i.materials}</div>
        </div>

        <div class="image">
          <img src="\${i.image}">
        </div>
      </div>
    \`).join('');
}

load();
</script>

</body>
</html>`;
}
