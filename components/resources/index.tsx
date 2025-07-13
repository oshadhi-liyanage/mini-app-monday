import { ExternalLink, Code2, Wrench, Globe } from "lucide-react";
import { Londrina_Solid } from "next/font/google";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResourceCard from "../resource-card";

const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const templates = [
  {
    title: "Builders Garden",
    description: "Next.js Starter Kit for Farcaster Mini Apps",
    link: "https://github.com/builders-garden/farcaster-miniapp-starter",
  },
  {
    title: "MiniKit",
    description: "Easiest way to build Mini Apps on Base",
    link: "https://docs.base.org/wallet-app/build-with-minikit/overview",
  },
  {
    title: "Neynar",
    description: "Farcaster Mini apps quickstart by neynar",
    link: "https://github.com/neynarxyz/create-farcaster-mini-app/",
  },
];

const aiTools = [
  {
    title: "Cursor",
    link: "https://cursor.sh/",
  },
  {
    title: "Claude Code",
    link: "https://www.anthropic.com/claude-code",
  },
  {
    title: "v0",
    link: "https://v0.dev/",
  },
  {
    title: "GitHub Copilot",
    link: "https://github.com/features/copilot",
  },
];

const deployment = [
  {
    title: "Vercel",
    link: "https://vercel.com/",
  },
];

const databases = [
  {
    title: "Neon",
    link: "https://neon.tech/",
  },
  {
    title: "Turso",
    link: "https://turso.tech/",
  },
];

const externalApis = [
  {
    title: "Neynar API",
    description: "Easiest way to get data from Farcaster",
    link: "https://docs.neynar.com/",
  },
];

const docs = [
  {
    title: "Farcaster Mini Apps Docs",
    link: "https://miniapps.farcaster.xyz/",
  },
  {
    title: "dTech",
    link: "https://dtech.vision/farcaster/",
  },
];

const personalizedOnChainContent = [
  {
    title: "getembeded.ai",
    link: "https://getembed.ai/",
  },
];

export default function Resources() {
  return (
    <div className="mt-1 px-4">
      <div className="text-left mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${londrina.className}`}>
          Mini App Builder Resources 🚀
        </h2>
        <p className="text-muted-foreground">
          Essential tools and templates to kickstart your mini app development
          journey
        </p>
      </div>
      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Mini App Templates
      </h3>
      <ResourceCard cardData={templates} />

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        AI tools
      </h3>
      <ResourceCard cardData={aiTools} />

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Deployment
      </h3>
      <ResourceCard cardData={deployment} />

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Databases
      </h3>
      <ResourceCard cardData={databases} />

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        External APIs
      </h3>
      <ResourceCard cardData={externalApis} />

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Documentation
      </h3>
      <ResourceCard cardData={docs} />

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Personalized On-Chain Content
      </h3>
      <ResourceCard cardData={personalizedOnChainContent} />
    </div>
  );
}
