import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BookingsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
              <div className="h-6 w-16 bg-muted rounded"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 w-28 bg-muted rounded"></div>
            <div className="h-3 w-20 bg-muted rounded"></div>
            <div className="h-3 w-24 bg-muted rounded"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 w-20 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
