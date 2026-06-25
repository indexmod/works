const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEUsZO7APvo_amXquaTettgvbk8RQ_Yq81diOF36jJvNBIzRjTC6r_quylZ54h6YFKs7qBiUJLvtd7/pub?gid=0&single=true&output=csv";

console.log("START");

async function test() {

    try {

        const res = await fetch(SHEET_URL);

        console.log("STATUS:", res.status);
        console.log("TYPE:", res.headers.get("content-type"));

        const text = await res.text();

        console.log("RAW FIRST 500:");
        console.log(text.slice(0, 500));

        document.body.innerHTML += "<pre>" + text.slice(0, 500) + "</pre>";

    } catch (e) {
        console.error("FETCH ERROR:", e);
    }
}

test();
