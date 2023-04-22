import { createRequire } from "module";
const require = createRequire(import.meta.url);

import {Readability} from "@mozilla/readability";
import DOMPurify from "dompurify";
import {JSDOM} from "jsdom";
const {isMainThread, parentPort, workerData} = require("worker_threads");

export function worker(article) {

    // Create DOM
    const doc = new JSDOM(article.htmlContent, {url: article.url});
    // Create Mozilla Reader
    let reader = new Readability(doc.window.document).parse();
    // Purify HTML
    const purify = DOMPurify(doc.window);

    article.scrapedDateTime = new Date().toISOString();
    article.title = (doc.window.document.title != null) ? doc.window.document.title.substring(0, 64) : null;
    article.htmlContent = purify.sanitize(reader.content);
    article.textContent = reader.textContent;
    article.readabilityAuthorMetadata = (reader.byline != null) ? reader.byline.substring(0, 255) : null;
    article.readabilityTitle = (reader.title != null && reader.title !== "") ? reader.title.substring(0, 255) : null;
    article.readabilityExcerpt = (reader.excerpt != null) ? reader.excerpt : null;
    article.readabilityDir = (reader.dir != null) ? reader.dir.substring(0, 255) : null;
    article.readabilityLang = (reader.lang != null) ? reader.lang.substring(0, 255) : null;
    article.readabilitySiteName = (reader.siteName != null) ? reader.siteName.substring(0, 255) : null;
    article.summary = null;
    article.sentiment = null;
    article.relevance = null;

    return article;
}

if (!isMainThread) {
    parentPort.postMessage(worker(workerData.article));
}
