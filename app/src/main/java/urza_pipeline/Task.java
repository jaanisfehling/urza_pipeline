package urza_pipeline;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.sql.*;
import java.time.Instant;

public class Task implements Runnable {
    private String url;
    private String html;
    private String date;

    public Task(String url, String html) {
        this.url = url;
        this.html = html;
    }

    public void run() {
        Document doc = Jsoup.parse(html);

        // Use current UTC timestamp
        Timestamp timestamp = Timestamp.from(Instant.now());

        String headline = doc.getElementsByTag("h1").get(0).text();
        String content = "content";
        String author = "author";
        String summary = "summary";
        double sentiment = 0.999;

        ProcessBuilder pb = new ProcessBuilder("node", "js_tasks.js", html);
        try {
            Process p = pb.start();
            this.html = new String(p.getInputStream().readAllBytes());
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        // Save to database
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:32768/postgres", "postgres", "mysecretpassword");

            stmt = conn.prepareStatement("INSERT INTO \"Article\" (url, date_time, headline, html, content, author, summary, sentiment) values (?, ?, ?, ?, ?, ?, ?, ?)");
            stmt.setString(1, url);
            stmt.setTimestamp(2, timestamp);
            stmt.setString(3, headline);
            stmt.setString(4, html);
            stmt.setString(5, content);
            stmt.setString(6, author);
            stmt.setString(7, summary);
            stmt.setDouble(8, sentiment);
            stmt.executeUpdate();

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                    conn.close();
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
