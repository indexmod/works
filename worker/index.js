export default {
async fetch(req, env) {

const url = new URL(req.url);

// GET ARTWORKS
if (url.pathname === "/api/artworks") {

    const { results } = await env.DB.prepare(
        "SELECT * FROM artworks ORDER BY id"
    ).all();

    return Response.json(results);
}

// SAVE TEXT
if (url.pathname === "/api/save") {

    const data = await req.json();

    for (const item of data) {
        await env.DB.prepare(
            "UPDATE artworks SET content=? WHERE id=?"
        ).bind(item.html, item.id).run();
    }

    return Response.json({ ok: true });
}

// UPLOAD IMAGE (R2)
if (url.pathname === "/api/upload") {

    const form = await req.formData();
    const file = form.get("file");
    const id = form.get("id");
    const type = form.get("type");

    const key = `images/${id}-${type}.jpg`;

    await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
    });

    const url = `/images/${id}-${type}.jpg`;

    await env.DB.prepare(
        type === "main"
        ? "UPDATE artworks SET image=? WHERE id=?"
        : "UPDATE artworks SET detail_image=? WHERE id=?"
    ).bind(url, id).run();

    return Response.json({ url });
}

return new Response("Not found", { status: 404 });
}
};
