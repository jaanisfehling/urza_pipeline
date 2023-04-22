import pg from "pg";

export const client = new pg.Client({
    host: "host.docker.internal",
    port: 32768,
    user: "postgres",
    password: "mysecretpassword",
});
await client.connect();

export async function saveArticle(article) {
    const text = "INSERT INTO \"article\" (url, scraped_date_time, site_name, title, text_content, html_content, author_metadata, lang, content_direction, excerpt, summary, positive_sentiment, neutral_sentiment, negative_sentiment) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)"
    const values = [article.url, article.scraped_date_time, article.site_name, article.title, article.text_content, article.html_content, article.author_metadata, article.lang, article.content_direction, article.excerpt, article.summary, article.positive_sentiment, article.neutral_sentiment, article.negative_sentiment]

    try {
        const res = await client.query(text, values);
        console.log("Saved article to database: " + article.url)
        return true;
    } catch (e) {
        console.error("Cannot save to database:\n", e.message);
        return false;
    }
}
