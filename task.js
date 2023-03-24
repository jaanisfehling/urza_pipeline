import {Readability} from "@mozilla/readability";
import DOMPurify from "dompurify";
import jsdom from "jsdom";

const {JSDOM} = jsdom;

export function task(article) {

    // Create DOM
    const doc = new JSDOM(article.htmlContent, {url: article.url});
    // Create Mozilla Reader
    let reader = new Readability(doc.window.document).parse();
    // Purify HTML
    const purify = DOMPurify(doc.window);

    // Save values to article object
    article.title = reader.title;
    article.htmlContent = purify.sanitize(reader.content);
    article.textContent = reader.textContent;
    article.authorMetadata = reader.byline ?? "";
    article.readabilityExcerpt = reader.excerpt;
    article.readabilityDir = reader.dir ?? "";
    article.readabilityLang = reader.lang ?? "";
    article.readabilitySiteName = reader.siteName ?? "";
    article.summary = "summary";
    article.sentiment = 0.0;
    article.relevance = 0.0;

    return article;
}
