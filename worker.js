export default {
  async fetch() {

    const API =
      "https://api.github.com/repos/indexmod/works/contents/works";

    const res = await fetch(API, {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "indexmod"
      }
    });

    const files = await res.json();

    const mdFiles = files.filter(f => f.name.endsWith(".md"));

    const works = [];

    for (const file of mdFiles) {

      const md = await fetch(file.download_url).then(r => r.text());

      const meta = parse(md);

      works.push(meta);
    }

    return new Response(JSON.stringify(works), {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

function parse(md) {

  const meta = {};
  const match = md.match(/---([\s\S]*?)---([\s\S]*)/);

  if (match) {

    match[1].split("\n").forEach(line => {

      const i = line.indexOf(":");
      if (i === -1) return;

      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();

      meta[k] = v;
    });
  }

  return meta;
}
