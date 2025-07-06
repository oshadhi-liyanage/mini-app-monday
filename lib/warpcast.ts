import { env } from "@/lib/env";

/**
 * Get the farcaster manifest for the frame, generate yours from Warpcast Mobile
 *  On your phone to Settings > Developer > Domains > insert website hostname > Generate domain manifest
 * @returns The farcaster manifest for the frame
 */
export async function getFarcasterManifest() {
  let frameName = "Miniapp Monday";
  let noindex = false;
  const appUrl = env.NEXT_PUBLIC_URL;
  if (appUrl.includes("localhost")) {
    frameName += " Local";
    noindex = true;
  } else if (appUrl.includes("ngrok")) {
    frameName += " NGROK";
    noindex = true;
  } else if (appUrl.includes("https://dev.")) {
    frameName += " Dev";
    noindex = true;
  }
  return {
    accountAssociation: {
      header: env.NEXT_PUBLIC_FARCASTER_HEADER,
      payload: env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      signature: env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
    },
    frame: {
      version: "1",
      name: frameName,
      iconUrl: `${appUrl}/images/mam_icon_url.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/images/mam_icon_url.png`,
      buttonTitle: `Discover Miniapps`,
      splashImageUrl: `${appUrl}/images/mam_splash_img.png`,
      splashBackgroundColor: "#D397F8",
      webhookUrl: `https://api.neynar.com/f/app/a8d4ab71-5417-406b-aef2-9991b7179618/event`,
      // Metadata https://github.com/farcasterxyz/miniapps/discussions/191
      subtitle: "Miniapp monday", // 30 characters, no emojis or special characters, short description under app name
      description: "Miniapp monday", // 170 characters, no emojis or special characters, promotional message displayed on Mini App Page
      primaryCategory: "social",
      tags: ["miniapp", "miniapp-monday"], // up to 5 tags, filtering/search tags
      tagline: "Miniapp monday ", // 30 characters, marketing tagline should be punchy and descriptive
      ogTitle: `${frameName}`, // 30 characters, app name + short tag, Title case, no emojis
      ogDescription: "Miniapp monday", // 100 characters, summarize core benefits in 1-2 lines
      // screenshotUrls: [
      //   // 1284 x 2778, visual previews of the app, max 3 screenshots
      //   `${appUrl}/images/feed.png`,
      // ],
      heroImageUrl: `${appUrl}/images/hero_image_url.png`, // 1200 x 630px (1.91:1), promotional display image on top of the mini app store
      ogImageUrl: `${appUrl}/images/hero_image_url.png`, // 1200 x 630px (1.91:1), promotional image, same as app hero image
      noindex: noindex,
    },
  };
}
