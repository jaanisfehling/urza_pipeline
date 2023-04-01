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

export async function saveArticle(article) {
    const text = "INSERT INTO \"article\" (url, date_time, site_name, title, html_content, text_content, readability_author_metadata, readability_title, readability_excerpt, readability_dir, readability_lang, readability_site_name, summary, sentiment, relevance) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)"
    const values = [article.url, article.dateTime, article.siteName, article.title, article.htmlContent, article.textContent, article.readabilityAuthorMetadata, article.readabilityTitle, article.readabilityExcerpt, article.readabilityDir, article.readabilityLang, article.readabilitySiteName, article.summary, article.sentiment, article.relevance]

    try {
        const res = await client.query(text, values);
        console.log("Saved article to database")
        return res;
    } catch (e) {
        console.log(e, "Cannot save to database");
    }
}

// export async function updateMostRecentArticle(article) {
//     const text = "UPDATE \"target\" SET most_recent_article_url=$1 WHERE list_view_url=$2"
//     const values = [article.url, article.listViewUrl]
//
//     try {
//         const res = await client.query(text, values);
//         console.log("Saved article to database")
//         return res;
//     } catch (e) {
//         console.log(e, "Cannot save to database");
//     }
// }
