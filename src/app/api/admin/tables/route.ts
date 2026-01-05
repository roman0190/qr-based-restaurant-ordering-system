import dbConnect from "@/lib/mongoose";
import Table from "@/models/Table";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const table = await Table.findById(id);
      if (!table)
        return NextResponse.json(
          { ok: false, error: "Table not found" },
          { status: 404 }
        );
      return NextResponse.json({ ok: true, table });
    }

    const tables = await Table.find({}).sort({ number: 1 });
    return NextResponse.json({ ok: true, tables });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.number) {
      return NextResponse.json(
        { ok: false, error: "Table number is required" },
        { status: 400 }
      );
    }

    const table = await Table.create(body);
    return NextResponse.json({ ok: true, table });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { ok: false, error: "Table number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const table = await Table.findByIdAndDelete(id);
    if (!table)
      return NextResponse.json(
        { ok: false, error: "Table not found" },
        { status: 404 }
      );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const table = await Table.findByIdAndUpdate(id, body, { new: true });
    if (!table)
      return NextResponse.json(
        { ok: false, error: "Table not found" },
        { status: 404 }
      );

    return NextResponse.json({ ok: true, table });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
