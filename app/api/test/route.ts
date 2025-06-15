import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("came here");
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized - No auth token" },
      { status: 401 }
    );
  }

  // Get the FID from the header set by middleware
  const fid = req.headers.get("x-user-fid");

  if (!fid) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid token" },
      { status: 401 }
    );
  }

  // Log the FID for debugging
  console.log({ fid });

  return NextResponse.json({
    message: "Authentication successful!",
    timestamp: new Date().toISOString(),
    fid: parseInt(fid, 10),
  });
}
