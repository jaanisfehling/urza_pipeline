import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { WebSocketServer } from 'ws';
import {saveArticle} from "./db.js";
const {Worker} = require("worker_threads");


const wss = new WebSocketServer({ port: 8888 })
console.log("Opened websocket at Port 8888");
// const sender = new WebSocket("ws://localhost:8000/ws/news");


wss.on("connection", ws => {
    console.log("New connection");

    ws.on("message", async data => {
        if (data && data != "") {
            try {
                let article = JSON.parse(data.toString());
                console.log(article.url);
                const worker = new Worker("./worker.js", {
                    workerData: {
                        article: article
                    }
                });
                worker.once("message", async result => {
                    await saveArticle(result);
                    // sender.send(JSON.stringify(result));
                });
                worker.on("error", (error) => {
                    console.log("Error in Worker for " + article.url + ":\n" + error);
                });
            } catch (e) {
                console.log(e);
            }
        }
    });
});
