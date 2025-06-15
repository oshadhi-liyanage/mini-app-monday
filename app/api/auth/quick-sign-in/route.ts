import { env } from "@/lib/env";
import { fetchUser } from "@/lib/neynar";
import { createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const client = createClient();

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }
    //  console.log("authorization 11111111111", authorization);
    // Verify the Quick Auth token
    console.log({
      token: authorization.split(" ")[1] as string,
      domain: env.APP_DOMAIN,
    });
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: env.APP_DOMAIN,
    });

    console.log("payload 22222222222", payload);

    console.log("payload", payload);

    // if (payload.sub !== fid.toString()) {
    //   return NextResponse.json(
    //     { error: "Token FID mismatch" },
    //     { status: 401 }
    //   );
    // }

    const fid = payload.sub;
    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 401 });
    }
    // Generate JWT token for your app
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const appToken = await new jose.SignJWT({
      fid: fid,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const user = await fetchUser(fid);

    // Create the response
    const response = NextResponse.json({ success: true, user });

    // Set the auth cookie with the JWT token
    response.cookies.set({
      name: "auth_token",
      value: appToken,
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
}
