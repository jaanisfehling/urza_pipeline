import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { WebSocketServer, WebSocket } from 'ws';
import {saveArticle} from "./db.js";
const {Worker} = require("worker_threads");

const wss = new WebSocketServer({ port: 9000 })
console.log("Opened websocket at Port 9000");

// const token = process.env.TOKEN;
const token = "2cda14bbd4aa175d16d4d7314c32f2edc89f9956";
const options = {
    headers: {
        "authorization": "Token " + token,
        "origin": "ws://127.0.0.1:8000"
    }
};
const ws = new WebSocket("ws://localhost:8000/ws/news/", [], options);


wss.on("connection", listener => {
    console.log("New connection");

    listener.on("message", async data => {
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
                    sender.send(JSON.stringify(result));
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
