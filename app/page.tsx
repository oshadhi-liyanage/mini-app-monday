import App from "@/components/app";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/mam_icon_url.png`,
  button: {
    title: "Launch App",
    action: {
      type: "launch_frame",
      name: "MM",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/mam_splash_img.png`,
      splashBackgroundColor: "#D397F8",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "MM",
    openGraph: {
      title: "MM",
      description: "Miniapp Monday",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
