import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { WebSocketServer, WebSocket } from 'ws';
import {saveArticle} from "./db.js";
const {Worker} = require("worker_threads");


// const token = process.env.TOKEN;
const token = "e2d57d8781555c1f066258cd6ed24e91d9f0b98b";
const options = {
    headers: {
        "authorization": "Token " + token,
        "origin": "ws://127.0.0.1:8000"
    }
};

let client;
function connect() {
    client = new WebSocket("ws://127.0.0.1:8000/ws/news/", [], options);
    client.on("open", function() {
        console.log("Connected to main server");
    });
    client.on("error", function() {
        console.error("Error on main server websocket");
    });
    client.on("close", function() {
        console.log("Connection closed to main server. Reconnecting...");
        setTimeout(connect, 5000);
    });
}
connect();

const server = new WebSocketServer({ port: 9000 })
console.log("Opened websocket at port 9000");
server.on("connection", listener => {
    console.log("New crawler connection");

    listener.on("message", async data => {
        if (data && data !== "") {
            try {
                let article = JSON.parse(data.toString());
                console.log("Received Article: " + article.url);
                const worker = new Worker("./worker.js", {
                    workerData: {
                        article: article
                    }
                });
                worker.once("message", async article => {
                    if (article != null) {
                        client.send(JSON.stringify(article));
                    }
                });
                worker.on("error", (e) => {
                    console.error("Error in worker for " + article.url + ":\n" + e.message);
                });
            } catch (e) {
                console.error("Error receiving Data:\n", e.message);
            }
        }
    });
});
