import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Make io globally available for API routes
  global.io = io;

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("join-table", (tableNumber) => {
      socket.join(`table-${tableNumber}`);
      console.log(`📍 Socket ${socket.id} joined table-${tableNumber}`);
    });

    socket.on("trey-update", (data) => {
      console.log("🔄 Trey update from:", socket.id, "for table:", data.tableNumber);
      socket.to(`table-${data.tableNumber}`).emit("trey-changed", data.trey);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
🚀 Server ready at http://${hostname}:${port}
⚡ Socket.IO ready at ws://${hostname}:${port}/api/socket
      `);
    });
});
