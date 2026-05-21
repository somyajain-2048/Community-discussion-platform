import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
}

export function CommunityCard({ id, name, description, memberCount, category }: CommunityCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-gray-700 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
            {category}
          </span>
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Users className="h-3 w-3" />
            <span>{memberCount}</span>
          </div>
        </div>
        <CardTitle className="text-xl">
          <Link href={`/c/${id}`} className="hover:text-white transition-colors">
            c/{name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
        <Link href={`/c/${id}`} className="w-full mt-2">
          <Button variant="outline" className="w-full">View Community</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
