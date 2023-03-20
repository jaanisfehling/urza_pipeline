package urza_pipeline;

import java.sql.PreparedStatement;

public class Task implements Runnable {
    private String html;
    private String date;

    public Task(String html) {
        this.html = html;
    }

    public void run() {
        String custname = request.getParameter("customerName");
        String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
        PreparedStatement pstmt = connection.prepareStatement(query);
        pstmt.setString(1, custname);
        ResultSet results = pstmt.executeQuery();
    }
}
