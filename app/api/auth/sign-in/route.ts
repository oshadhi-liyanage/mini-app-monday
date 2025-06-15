import { env } from "@/lib/env";
import { fetchUser } from "@/lib/neynar";
import { createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

export const POST = async (req: NextRequest) => {
  try {
    const { token, fid } = await req.json();

    // Verify the Quick Auth token
    const payload = await client.verifyJwt({
      token,
      domain: env.NEXT_PUBLIC_URL,
    });

    if (payload.sub !== fid.toString()) {
      return NextResponse.json(
        { error: "Token FID mismatch" },
        { status: 401 }
      );
    }

    // Fetch user data from Neynar
    const user = await fetchUser(fid);

    // Create the response
    const response = NextResponse.json({ success: true, user });

    // Set the auth cookie with the Quick Auth token
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Quick Auth sign-in error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
};
