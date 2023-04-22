import pg from "pg";

export const client = new pg.Client({
    host: "host.docker.internal",
    port: 32768,
    user: "postgres",
    password: "mysecretpassword",
});
await client.connect();

export async function saveArticle(article) {
    const text = "INSERT INTO \"article\" (url, scraped_date_time, title, html_content, text_content, readability_author_metadata, readability_title, readability_excerpt, readability_dir, readability_lang, readability_site_name, summary, sentiment, relevance) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)"
    const values = [article.url, article.scrapedDateTime, article.title, article.htmlContent, article.textContent, article.readabilityAuthorMetadata, article.readabilityTitle, article.readabilityExcerpt, article.readabilityDir, article.readabilityLang, article.readabilitySiteName, article.summary, article.sentiment, article.relevance]

    try {
        const res = await client.query(text, values);
        console.log("Saved article to database: " + article.url)
        return true;
    } catch (e) {
        console.error("Cannot save to database:\n", e.message);
        return false;
    }
}
