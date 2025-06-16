import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { NextResponse } from "next/server";

if (!process.env.NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is not set");
}

const client = new NeynarAPIClient(
  new Configuration({
    apiKey: process.env.NEYNAR_API_KEY,
  })
);

export async function POST(request: Request) {
  try {
    const webhookData = await request.json();
    console.log("webhookData", webhookData);

    // Verify this is a cast.created event with your target phrase
    if (
      webhookData.type === "cast.created" &&
      webhookData.data.author.fid == "1058287" &&
      webhookData.data.text.includes("miniapp")
    ) {
      // Send notification to all mini app users
      const notification = {
        title: "📱 New Update!",
        body: "Hi miniapp lovers - check out the latest update!",
        target_url: "https://mini-app-monday.vercel.app/",
      };

      const response = await client.publishFrameNotifications({
        targetFids: [], // Empty array targets all users with notifications enabled
        notification: notification,
      });

      console.log("Notifications sent:", response);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
