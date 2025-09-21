import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History } from "lucide-react"

import type { HistoryItem } from "@/interfaces/DashboardData"

interface props {
  history: HistoryItem[]
}
export function HistoryCard({ history }: props) {
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
                <TableHead className="table-cell">Fecha</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.customer.name}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">
                        {item.booking.bookingServices.map((b, index) => (
                          <div key={index}>{b.service.name}</div>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {item.booking.bookingServices.map((b, index) => (
                      <div key={index}>{b.service.name}</div>
                    ))}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(item.timeStart).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}{' '}
                    {new Date(item.timeStart).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell className="table-cell sm:hidden">
                  <div>
                      {new Date(item.timeStart).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                    <div>
                      {new Date(item.timeStart).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.priceAtBooking}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
