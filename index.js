const express = require("express");
const phin = require("phin");

const app = express();
const PORT = process.env.PORT || 8888;
const TOPGG_API_KEY = process.env.TOPGG_API_KEY || require("./dev.json").TOPGG_API_KEY;
var globals = {
    "ticketbot-servercount": "",
};

app.get("/", (req, res) => {
    res.send("You are using Isaac's public API!");
});

app.get("/api/ticketbot-servercount", (req, res) => {
    res.json({
        servers: globals["ticketbot-servercount"],
    });
});

app.listen(PORT, () => {
    console.log(`Server online on port ${PORT}`);

    refreshAPI();
});

async function refreshAPI () {
    const serverCount = await reqBotServers();
    globals["ticketbot-servercount"] = serverCount;
}

async function reqBotServers () {
    return new Promise((resolve, _reject) => {
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
}

module.exports = app;