import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ServicesLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 w-24 bg-muted rounded"></div>
            <div className="h-3 w-20 bg-muted rounded"></div>
            <div className="h-3 w-28 bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
