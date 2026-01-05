import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Item from "@/models/Item";
import { deletePublicFile } from "@/lib/files";

function invalidId(id: string) {
  return !mongoose.isValidObjectId(id);
}

/* ================= GET ================= */
export async function GET(req: Request) {
  try {
    const { id } = await req.json();

    if (invalidId(id)) {
      return NextResponse.json(
        { ok: false, error: "invalid id" },
        { status: 400 }
      );
    }

    await dbConnect();

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { ok: false, error: "not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
/* ================= PUT ================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, imageUrl, ...rest } = body;

    if (invalidId(id)) {
      return NextResponse.json(
        { ok: false, error: "invalid id" },
        { status: 400 }
      );
    }

    await dbConnect();

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { ok: false, error: "not found" },
        { status: 404 }
      );
    }

    // image change হলে old image delete
    if ("imageUrl" in body && imageUrl !== item.imageUrl) {
      if (item.imageUrl) await deletePublicFile(item.imageUrl);
      item.imageUrl = imageUrl;
    }

    Object.assign(item, rest);
    await item.save();

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    console.log("DELETE id:", id);

    if (invalidId(id)) {
      return NextResponse.json(
        { ok: false, error: "invalid id" },
        { status: 400 }
      );
    }

    await dbConnect();

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { ok: false, error: "not found" },
        { status: 404 }
      );
    }

    if (item.imageUrl) await deletePublicFile(item.imageUrl);

    await item.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
