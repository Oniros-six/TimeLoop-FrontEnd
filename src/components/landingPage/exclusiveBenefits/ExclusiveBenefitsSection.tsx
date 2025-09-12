import { Crown, Zap, Gift, Users } from "lucide-react"
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown"
import "@leenguyen/react-flip-clock-countdown/dist/index.css"

export default function ExclusiveBenefitsSection() {
  const benefits = [
    {
      icon: Crown,
      title: "Acceso prioritario",
      description: "Obtén acceso prioritario a nuevas funcionalidades",
    },
    {
      icon: Zap,
      title: "Configuración prioritaria",
      description: "Nuestro equipo configurará tu TimeLoop personalmente",
    },
    {
      icon: Gift,
      title: "Acceso gratuito",
      description: "2 meses sin costo! (Limitado: 10 cupos restantes)",
    },
    {
      icon: Users,
      title: "Soporte técnico prioritario",
      description: "Recibí ayuda rápida y personalizada de nuestro equipo cada vez que necesites asistencia.",
    },
  ]

  const targetDate = new Date(new Date().getFullYear(), 9, 1);

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 mt-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            Solo para Early Adopters
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Beneficios <span className="text-primary">Exclusivos</span> del Prelanzamiento
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Reserva tu cupo ahora y obtén ventajas únicas que no estarán disponibles después del lanzamiento oficial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-card-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-card border border-border rounded-2xl p-2 md:p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              <span className="text-lg font-medium">Oportunidad por tiempo limitado</span>
            </div>

            {/* Reloj para pantallas grandes */}
            <div className="mb-6 hidden sm:flex justify-center">
              <FlipClockCountdown
                to={targetDate.getTime()}
                labels={["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"]}
                labelStyle={{
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: "hsl(var(--muted-foreground))",
                }}
                digitBlockStyle={{
                  width: 50,
                  height: 60,
                  fontSize: 24,
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  borderRadius: 8,
                }}
                dividerStyle={{
                  color: "hsl(var(--primary))",
                  height: 1,
                }}
                separatorStyle={{
                  color: "hsl(var(--primary))",
                  size: "6px",
                }}
                duration={0.5}
              />
            </div>

            {/* Reloj para mobile */}
            <div className="mb-6 flex sm:hidden justify-center">
              <FlipClockCountdown
                to={targetDate.getTime()}
                labels={["", "", "", ""]}
                labelStyle={{
                  fontSize: 0,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: "hsl(var(--muted-foreground))",
                }}
                digitBlockStyle={{
                  width: 26,
                  height: 26,
                  fontSize: 13,
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  borderRadius: 8,
                }}
                dividerStyle={{
                  color: "hsl(var(--primary))",
                  height: 1,
                }}
                separatorStyle={{
                  color: "hsl(var(--primary))",
                  size: "6px",
                }}
                duration={0.5}
              />
            </div>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground pl-10">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                <span className="text-left">Sin compromisos</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                <span className="text-left">Cancela cuando quieras</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
