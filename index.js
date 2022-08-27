const express = require("express");
const phin = require("phin");

var app = express();
const PORT = process.env.PORT || 8888;
const TOPGG_API_KEY = process.env.TOPGG_API_KEY || require("./dev.json").TOPGG_API_KEY;
app.globals = {
    "ticketbot-servercount": {
        data: "",
        timestamp: null,
    },
};

app.get("/", (req, res) => {
    res.send("You are using Isaac's public API!");
});

app.get("/api/ticketbot-servercount", async (req, res) => {
    const serverCount = await reqBotServers();

    res.json({
        servers: serverCount,
    });
});

app.listen(PORT, () => {
    console.log(`Server online on port ${PORT}`);
});

async function reqBotServers () {
    let interval = 60_000;
    let timestamp = app.globals["ticketbot-servercount"].timestamp || 0;
    if (Date.now() - timestamp < interval) {
        return app.globals["ticketbot-servercount"].data;
    }

    const promise = new Promise((resolve, _reject) => {
        phin({
            url: "https://top.gg/api/bots/1002330889096794314",
            method: "GET",
            headers: { Authorization: TOPGG_API_KEY },
            parse: "json"
        }).then((data) => {
            resolve(data.body["server_count"] ? data.body["server_count"].toString() : "N/A");
        }).catch((e) => {
            resolve(e.toString())
        });
    });

    const data = await promise;
    app.globals["ticketbot-servercount"].data = data;
    app.globals["ticketbot-servercount"].timestamp = Date.now();
    return data;
}

module.exports = app;