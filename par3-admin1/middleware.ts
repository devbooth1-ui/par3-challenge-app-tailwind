import { NextResponse } from "next/server";

export function middleware(req: Request) {
  if (req.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 200 });
    preflight.headers.set("Access-Control-Allow-Origin", "*");
    preflight.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    preflight.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
    return preflight;
  }
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  return res;
}
export const config = { matcher: "/api/:path*" };
