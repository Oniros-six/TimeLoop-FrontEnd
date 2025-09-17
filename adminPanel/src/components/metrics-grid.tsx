import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { metrics } from "@/mocks/metrics"

// Datos centralizados en mocks/metrics

export function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 lg:px-2 xl:px-4">
            <CardTitle className="text-md sm:text-lg font-medium line-clamp-2">{metric.title}</CardTitle>
            <metric.icon className={`h-5 w-5 ${metric.color}`} />
          </CardHeader>
          <CardContent className="px-4 lg:px-2 xl:px-4">
            <div className="text-2xl lg:text-xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
