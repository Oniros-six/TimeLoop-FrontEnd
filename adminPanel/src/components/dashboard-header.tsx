export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground">Gestiona tu salón de belleza</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Fecha</p>
        <p className="font-medium capitalize">{currentDate}</p>
      </div>
    </div>
  )
}
