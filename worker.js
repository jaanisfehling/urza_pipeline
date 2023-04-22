import { createRequire } from "module";
const require = createRequire(import.meta.url);

import {isProbablyReaderable, Readability} from "@mozilla/readability";
import DOMPurify from "dompurify";
import {JSDOM} from "jsdom";
// import {finbert} from "./main.js";
const {isMainThread, parentPort, workerData} = require("worker_threads");
const tf = require('@tensorflow/tfjs-node');


export function worker(article) {
    const doc = new JSDOM(article.htmlContent, {url: article.url});

    if (!isProbablyReaderable(doc.window.document)) {
        article.isNew = false;
        return article;
    }

    let reader = new Readability(doc.window.document).parse();

    article.scraped_date_time = new Date().toISOString();
    article.site_name = (reader.siteName != null) ? reader.siteName.substring(0, 255) : null;
    article.title = (reader.title != null && reader.title !== "") ? reader.title.substring(0, 255) : null;
    article.text_content = reader.textContent;

    delete article.html;
    const purify = DOMPurify(doc.window);
    article.html_content = purify.sanitize(reader.content);

    article.author_metadata = (reader.byline != null) ? reader.byline.substring(0, 255) : null;
    article.lang = (reader.lang != null) ? reader.lang.substring(0, 255) : null;
    article.content_direction = (reader.dir != null) ? reader.dir.substring(0, 255) : null;
    article.excerpt = (reader.excerpt != null) ? reader.excerpt : null;
    article.summary = null;

    // const prediction = finbert.analyzeSentence(tf.reader.textContent);
    article.positive_sentiment = null;
    article.neutral_sentiment = null;
    article.negative_sentiment = null;

    return article;
}

if (!isMainThread) {
    parentPort.postMessage(worker(workerData.article));
}
