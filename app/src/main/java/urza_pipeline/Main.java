package urza_pipeline;

import java.net.InetSocketAddress;
import org.java_websocket.server.WebSocketServer;
import urza_pipeline.Server;

public class Main {
    public static void main(String[] args) {

        String host = "localhost";
        int port = 8888;

        WebSocketServer server = new Server(new InetSocketAddress(host, port));
        server.run();
    }
}
