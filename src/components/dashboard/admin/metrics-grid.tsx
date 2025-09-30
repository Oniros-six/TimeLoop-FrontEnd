import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, UserCheck, Clock } from "lucide-react";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { metricsAtom } from "@/atoms/metrics";

export function MetricsGrid() {
  const [user] = useAtom(userAtom);
  const [metricsData, setMetricsData] = useAtom(metricsAtom);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ONE_DAY = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return setLoading(false);

      const now = Date.now();

      // ✅ Si hay datos y no pasaron 24hs → usar cache
      if (metricsData.data && metricsData.timestamp && now - metricsData.timestamp < ONE_DAY) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/dashboard/metrics/${user.id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Error al cargar métricas");

        const data = await res.json();
        if (data.statusCode === 200) {
          setMetricsData({ data: data.data, timestamp: now });
        } else {
          throw new Error("Error en la respuesta de métricas");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar métricas");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user?.id]);

  if (loading) return <p>Cargando métricas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!metricsData.data) return <p>No hay métricas disponibles</p>;
  

  // Formateo de dinero con separador de miles y 2 decimales
  const formatMoney = (num: number) => num.toLocaleString("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Formateo de porcentaje con + si es positivo
  const formatDiff = (diff: number) => `${diff > 0 ? "+" : ""}${Math.round(diff)}%`;

  const metrics = metricsData.data

  const cards = [
    {
      title: "Ganancias este mes",
      value: formatMoney(metrics.earnsMetrics.earnsThisMonth),
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      diff: formatDiff(metrics.earnsMetrics.earnsDiff),
      diffValue: metrics.earnsMetrics.earnsDiff,
    },
    {
      title: "Nuevos clientes",
      value: metrics.newClientsMetrics.newClientsThisMonth,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      diff: formatDiff(metrics.newClientsMetrics.newClientsDiff),
      diffValue: metrics.newClientsMetrics.newClientsDiff,
    },
    {
      title: "Reservas este mes",
      value: metrics.bookingsMetrics.bookingsThisMonth,
      icon: <UserCheck className="h-5 w-5 text-purple-600" />,
      diff: formatDiff(metrics.bookingsMetrics.bookingsDiff),
      diffValue: metrics.bookingsMetrics.bookingsDiff,
    },
    {
      title: "Horario pico",
      value: `${metrics.rushHoursMetrics.peakRange.start} - ${metrics.rushHoursMetrics.peakRange.end}`,
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      diff: metrics.rushHoursMetrics.maxBookings,
      diffValue: metrics.rushHoursMetrics.maxBookings,
      diffLabel: "reservas en ese rango el mes anterior",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <Card key={i} className="justify-between">
          <CardHeader className="flex items-center justify-between px-4 lg:px-2 xl:px-4">
            <CardTitle className="text-md sm:text-lg font-medium line-clamp-2">{c.title}</CardTitle>
            {c.icon}
          </CardHeader>
          <CardContent className="px-4 lg:px-2 xl:px-4">
            <div className="text-2xl lg:text-xl font-bold">{c.value}</div>
            {c.diff !== undefined && (
              <p className={`text-sm mt-1 ${c.diffValue > 0 ? "text-green-600" : c.diffValue < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                {c.diff} {c.diffLabel || ""}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
