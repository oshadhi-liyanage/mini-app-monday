import { ExternalLink } from "lucide-react";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface CardData {
  title: string;
  link: string;
  description?: string;
}

export default function ResourceCard({ cardData }: { cardData: CardData[] }) {
  return (
    <div className="space-y-2 mb-4">
      {cardData.map((tool: any, index: any) => (
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
          {tool.description && (
            <CardContent className="pt-0">
              <CardDescription className="text-sm leading-relaxed">
                {tool.description}
              </CardDescription>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
