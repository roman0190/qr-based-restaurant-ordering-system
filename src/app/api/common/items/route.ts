import dbConnect from "@/lib/mongoose";
import Item from "@/models/Item";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();
    const items = await Item.find().sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, items });
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
    const { name, price, description, category, imageUrl, available } = body;
    if (!name || price == null)
      return NextResponse.json(
        { ok: false, error: "name and price required" },
        { status: 400 }
      );
    const item = await Item.create({
      name,
      price,
      description,
      category,
      imageUrl,
      available,
    });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
