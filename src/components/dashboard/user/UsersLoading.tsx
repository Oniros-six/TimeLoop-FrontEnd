import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UsersLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-48 bg-muted rounded"></div>
              </div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
