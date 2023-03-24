import fs from "fs";
import pg from "pg";

let settings = JSON.parse(fs.readFileSync("./settings.json", "utf8"));

export const client = new pg.Client({
    host: settings.db.host,
    port: settings.db.port,
    user: settings.db.user,
    password: settings.db.password,
});
await client.connect();

export async function saveArticle(client, article) {
    const text = "INSERT INTO \"Article\" VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)"
    const values = [article.url, article.siteName, article.dateTime, article.title, article.htmlContent, article.textContent, article.authorMetadata, article.readabilityExcerpt, article.readabilityDir, article.readabilityLang, article.readabilitySiteName, article.summary, article.sentiment, article.relevance]

    try {
        const res = await client.query(text, values);
        console.log("Saved article to database")
        return res;
    } catch (e) {
        console.log(e, "Cannot save to database");
    }
}