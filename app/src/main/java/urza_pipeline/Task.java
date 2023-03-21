package urza_pipeline;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.OffsetDateTime;

public class Task implements Runnable {
    private String html;
    private String date;

    public Task(String html) {
        this.html = html;
    }

    public void run() {
        Document doc = Jsoup.parse(html);

        String url = "example.com";
        String isoDate = doc.getElementByTag("time").attr("datetime");
        OffsetDateTime dateTime = OffsetDateTime.parse(isoDate);
        String headline = doc.getElementByTag("h1").text();
        String content = "content";
        String author = "author";
        String summary = "summary";
        double sentiment = 0.999;

        // Save to database
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/", "postgres", "mysecretpassword");

            stmt = conn.prepareStatement("INSERT INTO \"Article\" (url, date_time, headline, html, content, author, summary, sentiment) values (?, ?, ?, ?, ?, ?, ?, ?)");
            stmt.setString(1, url);
            stmt.setTimestamp(2, dateTime);
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
