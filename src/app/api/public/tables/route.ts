import { NextRequest, NextResponse } from "next/server";
import TableModel from "@/models/Table";
import dbConnect from "@/lib/mongoose";

// GET - Get table status
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const tableNumber = searchParams.get("table");

    if (!tableNumber) {
      return NextResponse.json(
        { error: "Table number is required" },
        { status: 400 }
      );
    }

    // Find table
    const table = await TableModel.findOne({ number: tableNumber });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json({
      table: {
        number: table.number,
        capacity: table.capacity,
        status: table.status,
      },
    });
  } catch (error) {
    console.error("Error fetching table status:", error);
    return NextResponse.json(
      { error: "Failed to fetch table status" },
      { status: 500 }
    );
  }
}
