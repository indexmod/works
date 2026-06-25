export default {
  async fetch(request) {

    const url = new URL(request.url);

    if (url.pathname === "/api/works") {
      return Response.json([
        {
          title: "Хор 002",
          year: 2026,
          size: "120 × 60 см",
          materials: "Фанера",
          image: "images/hor-002.jpg"
        }
      ]);
    }

    return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Works</title>
</head>
<body>

<div id="list">loading...</div>

<script>
async function load(){
  const res = await fetch('/api/works');
  const data = await res.json();

  document.getElementById('list').innerHTML =
    data.map(i =>
      '<div>' + i.title + ' ' + i.year + '</div>'
    ).join('');
}

load();
</script>

</body>
</html>
`, {
      headers: { "content-type": "text/html" }
    });
  }
}
