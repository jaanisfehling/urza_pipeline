package urza_pipeline;

import java.net.InetSocketAddress;
import org.java_websocket.server.WebSocketServer;
import urza_pipeline.Server;

public class App {
    public static void main(String[] args) {

        String host = "localhost";
        int port = 8887;

        WebSocketServer server = new Server(new InetSocketAddress(host, port));
        server.run();
    }
}
