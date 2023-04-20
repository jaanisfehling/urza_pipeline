import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { WebSocketServer } from 'ws';
import {saveArticle} from "./db.js";
const {Worker} = require("worker_threads");

const wss = new WebSocketServer({ port: 9000 })
console.log("Opened websocket at Port 9000");
// const sender = new WebSocket("ws://localhost:8000/ws/news");


wss.on("connection", ws => {
    console.log("New connection");

    ws.on("message", async data => {
        if (data && data != "") {
            try {
                let article = JSON.parse(data.toString());
                console.log("Received Article: " + article.url);
                const worker = new Worker("./worker.js", {
                    workerData: {
                        article: article
                    }
                });
                worker.once("message", async result => {
                    await saveArticle(result);
                    // sender.send(JSON.stringify(result));
                });
                worker.on("error", (e) => {
                    console.error("Error in Worker for " + article.url + ":\n" + e.message);
                });
            } catch (e) {
                console.error("Error receiving Data:\n", e.message);
            }
        }
    });
});
