import { NextRequest, NextResponse } from "next/server";
import TableSessionModel from "@/models/TableSession";
import TableModel from "@/models/Table";
import dbConnect from "@/lib/mongoose";

// Helper to get Socket.IO instance
function getIO() {
  return (global as any).io;
}

// POST - Create new table session
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { tableNumber, customerName, customerPhone, tablePin } =
      await request.json();

    // Validate required fields
    if (!tableNumber || !customerName || !customerPhone || !tablePin) {
      return NextResponse.json(
        { error: "Table number, customer name, phone, and PIN are required" },
        { status: 400 }
      );
    }

    // Check if table exists
    const table = await TableModel.findOne({ number: tableNumber });
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Check if there's already an active session for this table
    const existingSession = await TableSessionModel.findOne({
      tableNumber,
      IsValid: true,
    });

    if (existingSession) {
      return NextResponse.json(
        { error: "Table already has an active session" },
        { status: 409 }
      );
    }

    // Create new session
    const newSession = await TableSessionModel.create({
      customerName,
      customerPhone,
      tableNumber,
      tablePin,
      trey: [],
      IsValid: true,
    });

    // Update table status to occupied
    table.status = "occupied";
    await table.save();

    // Emit Socket.IO event to notify admin panel
    const io = getIO();
    if (io) {
      // Broadcast to all connected clients (especially admin)
      io.emit("table-status-updated", {
        tableNumber,
        status: "occupied",
        customerName,
        customerPhone,
      });
      console.log(`📢 Table ${tableNumber} occupied - broadcasted to all clients`);
    }

    return NextResponse.json(
      {
        message: "Session created successfully",
        session: {
          id: newSession._id,
          tableNumber: newSession.tableNumber,
          customerName: newSession.customerName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// GET - Validate PIN and get session
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const tableNumber = searchParams.get("table");
    const pin = searchParams.get("pin");

    if (!tableNumber || !pin) {
      return NextResponse.json(
        { error: "Table number and PIN are required" },
        { status: 400 }
      );
    }

    // Find active session for this table
    const session = await TableSessionModel.findOne({
      tableNumber,
      IsValid: true,
    });

    if (!session) {
      return NextResponse.json(
        { error: "No active session found for this table" },
        { status: 404 }
      );
    }

    // Validate PIN
    if (session.tablePin !== pin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    return NextResponse.json({
      session: {
        id: session._id,
        tableNumber: session.tableNumber,
        customerName: session.customerName,
        customerPhone: session.customerPhone,
        trey: session.trey,
        IsValid: session.IsValid,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json(
      { error: "Failed to validate session" },
      { status: 500 }
    );
  }
}

// PATCH - Update trey (add/update items)
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const { tableNumber, pin, trey } = await request.json();

    if (!tableNumber || !pin) {
      return NextResponse.json(
        { error: "Table number and PIN are required" },
        { status: 400 }
      );
    }

    // Find and validate session
    const session = await TableSessionModel.findOne({
      tableNumber,
      IsValid: true,
    });

    if (!session) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 404 }
      );
    }

    if (session.tablePin !== pin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // Update trey
    session.trey = trey;
    await session.save();

    return NextResponse.json({
      message: "Trey updated successfully",
      trey: session.trey,
    });
  } catch (error) {
    console.error("Error updating trey:", error);
    return NextResponse.json(
      { error: "Failed to update trey" },
      { status: 500 }
    );
  }
}

// DELETE - End session
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const tableNumber = searchParams.get("table");
    const pin = searchParams.get("pin");

    if (!tableNumber || !pin) {
      return NextResponse.json(
        { error: "Table number and PIN are required" },
        { status: 400 }
      );
    }

    // Find session
    const session = await TableSessionModel.findOne({
      tableNumber,
      IsValid: true,
    });

    if (!session) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 404 }
      );
    }

    if (session.tablePin !== pin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // End session
    session.IsValid = false;
    await session.save();

    // Update table status back to available
    const table = await TableModel.findOne({ number: tableNumber });
    if (table) {
      table.status = "available";
      await table.save();
    }

    // Emit Socket.IO event to notify admin panel
    const io = getIO();
    if (io) {
      io.emit("table-status-updated", {
        tableNumber,
        status: "available",
        customerName: null,
        customerPhone: null,
      });
      console.log(`📢 Broadcasted table ${tableNumber} is now available`);
    }

    return NextResponse.json({
      message: "Session ended successfully",
    });
  } catch (error) {
    console.error("Error ending session:", error);
    return NextResponse.json(
      { error: "Failed to end session" },
      { status: 500 }
    );
  }
}
