import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents exhausting database connections when using Next.js dev server.
 */
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise;
  return cached.conn;
}
