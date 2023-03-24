import { WebSocketServer } from 'ws';
import pg from "pg";
import * as fs from "fs";
import {client, saveArticle} from "./db.js";
import {task} from "./task.js";


const wss = new WebSocketServer({ port: 8888 })
console.log("Opened websocket at Port 8888")


wss.on("connection", ws => {
    console.log("New connection");

    ws.on("message", async data => {
        console.log("Received article");
        let article = JSON.parse(data);
        article = task(article);
        await saveArticle(client, article);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.onerror = function () {
        console.log("Websocket Error Occured");
    }
});
