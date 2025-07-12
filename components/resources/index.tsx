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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 ">
        {templates.map((template, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-1">
              <div className="flex items-center mb-1">
                {/* {template.icon} */}
                <CardTitle className="text-md flex items-center gap-2">
                  {template.title}
                  <a
                    href={template.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm leading-relaxed">
                {template.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        AI tools
      </h3>

      <div className="space-y-2 mb-4">
        {aiTools.map((tool, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 "
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-md flex items-center gap-2">
                  {tool.title}
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Deployment
      </h3>

      <div className="space-y-2 mb-4">
        {deployment.map((tool, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 "
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-md flex items-center gap-2">
                  {tool.title}
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        Databases
      </h3>

      <div className="space-y-2 mb-4">
        {databases.map((tool, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 "
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-md flex items-center gap-2">
                  {tool.title}
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h3 className={`text-xl font-bold mb-2 mt-1 ${londrina.className}`}>
        External APIs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {externalApis.map((api, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-1">
              <div className="flex items-center mb-1">
                <CardTitle className="text-md flex items-center gap-2">
                  {api.title}
                  <a
                    href={api.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm leading-relaxed">
                {api.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
