export default {
  async fetch(request, env) {

    const url = new URL(request.url);
    const path = url.pathname;

    // -------------------------
    // GET ALL WORKS
    // -------------------------
    if (path === "/api/list") {
      return await getWorks();
    }

    // -------------------------
    // UPDATE MD FILE
    // -------------------------
    if (path === "/api/save" && request.method === "POST") {
      const body = await request.json();
      return await saveFile(body, env);
    }

    return new Response("CMS API OK");
  }
};

// =========================
// GET WORKS FROM GITHUB
// =========================
async function getWorks() {

  const API =
    "https://api.github.com/repos/YOUR_USER/works/contents/works";

  const res = await fetch(API, {
    headers: {
      "Accept": "application/vnd.github+json"
    }
  });

  const files = await res.json();

  const mdFiles = files.filter(f => f.name.endsWith(".md"));

  const works = [];

  for (const f of mdFiles) {

    const md = await fetch(f.download_url).then(r => r.text());

    works.push(parseMD(md));
  }

  return new Response(JSON.stringify(works), {
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    }
  });
}

// =========================
// SAVE BACK TO GITHUB
// =========================
async function saveFile({ path, content, sha }, env) {

  const url =
    `https://api.github.com/repos/YOUR_USER/works/contents/${path}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      message: "update md via cms",
      content: btoa(unescape(encodeURIComponent(content))),
      sha: sha
    })
  });

  return new Response(await res.text(), {
    headers: { "content-type": "application/json" }
  });
}

// =========================
// FRONTMATTER PARSER
// =========================
function parseMD(md) {

  const match = md.match(/---([\s\S]*?)---([\s\S]*)/);

  const meta = {};

  if (match) {
    match[1].split("\n").forEach(line => {
      const i = line.indexOf(":");
      if (i === -1) return;
      meta[line.slice(0, i).trim()] =
        line.slice(i + 1).trim();
    });
  }

  return {
    ...meta,
    desc: match ? match[2].trim() : ""
  };
}
