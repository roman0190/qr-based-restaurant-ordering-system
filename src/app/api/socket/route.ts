import { NextRequest } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export const GET = async (req: NextRequest) => {
  if (!io) {
    const httpServer: any = (global as any).httpServer;
    if (!httpServer) {
      return new Response("Socket.IO not initialized", { status: 500 });
    }

    io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Join table room
      socket.on("join-table", (tableNumber: string) => {
        socket.join(`table-${tableNumber}`);
        console.log(`Socket ${socket.id} joined table-${tableNumber}`);
      });

      // Trey update event
      socket.on("trey-update", (data: { tableNumber: string; trey: any[] }) => {
        console.log("Trey update from:", socket.id, "for table:", data.tableNumber);
        // Broadcast to all clients in the table room except sender
        socket.to(`table-${data.tableNumber}`).emit("trey-changed", data.trey);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    console.log("Socket.IO server initialized");
  }

  return new Response("Socket.IO initialized", { status: 200 });
};

export const dynamic = "force-dynamic";
