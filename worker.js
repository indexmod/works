export default {
  async fetch(request, env) {

    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") return cors();

    // список работ
    if (path === "/api/works") {
      return await getWorks();
    }

    // сохранение md обратно в GitHub
    if (path === "/api/save" && request.method === "POST") {
      const body = await request.json();
      return await saveFile(body, env);
    }

    return new Response("indexmod works CMS");
  }
};

// ----------------------
// GET FILES FROM REPO
// ----------------------
async function getWorks() {

  const API =
    "https://api.github.com/repos/indexmod/works/contents/works";

  const res = await fetch(API, {
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "indexmod-worker"
    }
  });

  const files = await res.json();

  if (!Array.isArray(files)) {
    return json({ error: "GitHub API error", files });
  }

  const mdFiles = files.filter(f => f.name.endsWith(".md"));

  const works = [];

  for (const file of mdFiles) {

    const md = await fetch(file.download_url).then(r => r.text());
    works.push(parseMD(md, file.name));
  }

  return json(works);
}

// ----------------------
// SAVE FILE BACK TO GIT
// ----------------------
async function saveFile(data, env) {

  const { filename, content, sha } = data;

  const url =
    `https://api.github.com/repos/indexmod/works/contents/works/${filename}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "update works via cms",
      content: b64(content),
      sha: sha || undefined
    })
  });

  return json(await res.json());
}

// ----------------------
// FRONTMATTER PARSER
// ----------------------
function parseMD(md, filename) {

  const match = md.match(/---([\s\S]*?)---([\s\S]*)/);

  const meta = {};

  if (match) {
    match[1].split("\n").forEach(line => {
      const i = line.indexOf(":");
      if (i === -1) return;

      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();

      meta[k] = v;
    });
  }

  return {
    filename,
    ...meta,
    desc: match ? match[2].trim() : ""
  };
}

// ----------------------
// HELPERS
// ----------------------
function json(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json",
      ...corsHeaders()
    }
  });
}

function cors() {
  return new Response(null, {
    headers: corsHeaders()
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function b64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
