import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { WebSocketServer } from 'ws';
import {saveArticle} from "./db.js";
const {Worker} = require("worker_threads");


const wss = new WebSocketServer({ port: 8888 })
console.log("Opened websocket at Port 8888")


wss.on("connection", ws => {
    console.log("New connection");

    ws.on("message", async data => {
        console.log("Received article");
        let article = JSON.parse(data);
        const worker = new Worker("./worker.js", {
            workerData: {
                article: article
            }
        });
        worker.once("message", async result => {
            await saveArticle(result);
        });
        worker.on("error", (error) => {
            console.log("Error in Worker for " + article.url + error);
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.onerror = function () {
        console.log("Websocket Error Occured");
    }
});
