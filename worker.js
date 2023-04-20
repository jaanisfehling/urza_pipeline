import { createRequire } from "module";
const require = createRequire(import.meta.url);

import {Readability} from "@mozilla/readability";
import DOMPurify from "dompurify";
import {JSDOM} from "jsdom";
const {isMainThread, parentPort, workerData} = require("worker_threads");

// Example article object:
// {
//     "url": "http://example.com",
//     "siteName": "Example - News",
//     "htmlContent": "<html>Hello World</html>"
// }

export function worker(article) {

    // Create DOM
    const doc = new JSDOM(article.htmlContent, {url: article.url});
    // Create Mozilla Reader
    let reader = new Readability(doc.window.document).parse();
    // Purify HTML
    const purify = DOMPurify(doc.window);

    article.dateTime = new Date().toUTCString();
    article.title = doc.window.document.title;
    if (article.title != null) {
        article.title = article.title.substring(0, 64);
    }
    article.htmlContent = purify.sanitize(reader.content);
    article.textContent = reader.textContent;
    article.readabilityAuthorMetadata = reader.byline;
    if (article.readabilityAuthorMetadata != null) {
        article.readabilityAuthorMetadata = article.readabilityAuthorMetadata.substring(0, 255);
    }
    article.readabilityTitle = reader.title;
    if (article.readabilityTitle != null) {
        article.readabilityTitle = article.readabilityTitle.substring(0, 255);
    }
    article.readabilityExcerpt = reader.excerpt;
    article.readabilityDir = reader.dir;
    if (article.readabilityDir != null) {
        article.readabilityDir = article.readabilityDir.substring(0, 255);
    }
    article.readabilityLang = reader.lang;
    if (article.readabilityLang != null) {
        article.readabilityLang = article.readabilityLang.substring(0, 255);
    }
    article.readabilitySiteName = reader.siteName;
    if (article.readabilitySiteName != null) {
        article.readabilitySiteName = article.readabilitySiteName.substring(0, 255);
    }
    article.summary = null;
    article.sentiment = null;
    article.relevance = null;

    return article;
}

if (!isMainThread) {
    parentPort.postMessage(worker(workerData.article));
}
