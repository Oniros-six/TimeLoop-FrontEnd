import { Card, CardContent } from "@/components/ui/card"
import { Bell, BookOpen, Clock, CreditCard, Database, Gift, Images, Megaphone, Palette, Percent, Repeat, Share2, ShoppingCart, TrendingUp, Users, Zap } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Ahorro de Tiempo",
    description: "Tus clientes se agendan solos, reduciendo la carga de trabajo de tu personal.",
  },
  {
    icon: Bell,
    title: "Recordatorios Automáticos",
    description: "Evitá faltas con recordatorios automáticos vía email y WhatsApp 24 horas antes",
  },
  {
    icon: Database,
    title: "Historial de Clientes",
    description: "Mantén toda la información y reservas de tus clientes en un solo lugar.",
  },
  {
    icon: CreditCard,
    title: "Pagos Online",
    description: "Acepta pagos online o en efectivo, según prefieras.",
  },
  {
    icon: TrendingUp,
    title: "Análisis de Rendimiento",
    description: "Obtén insights claros sobre tu negocio y detecta oportunidades de mejora.",
  },
  {
    icon: Users,
    title: "Todo el Equipo",
    description: "Incluye a todos los miembros de tu negocio, sin importar su tamaño.",
  },
  {
    icon: Zap,
    title: "Integración Rápida",
    description: "Comienza a usar Timeloop en minutos, sin configuraciones complicadas.",
  },
  {
    icon: Share2,
    title: "Redes Sociales",
    description: "Muestra los enlaces a tus redes sociales para que tus clientes puedan seguirte y contactarte fácilmente.",
  },
]

const soonFeatures = [
  {
    icon: Repeat,
    title: "Suscripciónes",
    description: "Ofrece planes de suscripción mensual con beneficios exclusivos para tus clientes.",
  },
  {
    icon: Percent,
    title: "Promociones y descuentos",
    description: "Crea promociones, descuentos y sorteos para fidelizar y atraer más clientes.",
  },
  {
    icon: Gift,
    title: "Programa de Recompensas",
    description: "Premia a tus clientes frecuentes con beneficios y recompensas especiales.",
  },
  {
    icon: Images,
    title: "Catalogo",
    description: "Muestra un catálogo de productos o servicios con fotos para que tus clientes conozcan lo que ofreces.",
  },
]
export default function FeaturesSection() {
  return (
    <section id="features" className="bg-background mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Una herramienta que transforman tu negocio
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto text-pretty">
            Timeloop nace para optimizar al maximo tu tiempo y el de tu negocio, para que tengas control total.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg bg-card/50 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 border-border "
            >
              <CardContent className="pt-6 text-center">
                <div className="mb-6 flex justify-center">
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">Próximamente en TimeLoop</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {soonFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg bg-card/50 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 border-border "
              >
                <CardContent className="pt-6 text-center">
                  <div className="mb-6 flex justify-center">
                    <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}