import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { WebSocketServer } from 'ws';
import {saveArticle, updateMostRecentArticle} from "./db.js";
const {Worker} = require("worker_threads");


const wss = new WebSocketServer({ port: 8888 })
console.log("Opened websocket at Port 8888");
// const sender = new WebSocket("ws://localhost:8000/ws/news");


wss.on("connection", ws => {
    console.log("New connection");

    ws.on("message", async data => {
        console.log("Received article");
        if (data) {
            try {
                let article = JSON.parse(data.toString());
                const worker = new Worker("./worker.js", {
                    workerData: {
                        article: article
                    }
                });
                worker.once("message", async result => {
                    await saveArticle(result);
                    await updateMostRecentArticle(result);
                    // sender.send(JSON.stringify(result));
                });
                worker.on("error", (error) => {
                    console.log("Error in Worker for " + article.url + error);
                });
            } catch (e) {
                console.log(e);
            }
        }
    });
});
