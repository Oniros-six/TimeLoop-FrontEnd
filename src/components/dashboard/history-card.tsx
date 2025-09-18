import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"
import { historyData } from "@/mocks/history"

// Datos centralizados en mocks/history

export function HistoryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Historial
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">Servicio</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead className="hidden sm:table-cell">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.client}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{item.service}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{item.service}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.date}</TableCell>
                  <TableCell className="font-medium">{item.amount}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
