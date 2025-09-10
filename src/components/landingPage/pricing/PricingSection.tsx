import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PricingSection() {
  const plans = [
    {
      name: "Tarifa fija",
      subtitle: "Ideal para negocios con agenda estable",
      price: "$790",
      period: "/mes",
      features: [
        "Solo pagas si superas las 40 reservas mensuales",
        "Agenda online",
        "Gestión de clientes y citas",
        "Recordatorios y notificaciones automáticas",
        "Métricas básicas y reporte de clientes",
        "Pagos online y en efectivo",
        "Enlaces a redes sociales",
        "Soporte por email",
        "Panel de control completo",
      ],
      cta: "Comenzar ahora",
      recommended: false,
    },
    {
      name: "Según ingresos",
      subtitle: "Ideal para cualquier negocio, sin importar el tamaño",
      price: "1%",
      period: "de tu facturación",
      features: [
        "Solo pagas si se supera $50.000 en facturación",
        "Agenda online",
        "Gestión de clientes y citas",
        "Recordatorios y notificaciones automáticas",
        "Métricas avanzadas e historial de clientes",
        "Pagos online y en efectivo",
        "Enlaces a redes sociales",
        "Soporte por email prioritario",
        "Panel de control completo",
      ],
      cta: "Comenzar ahora",
      recommended: true,
    },
  ]
  

  return (
    <section id="plans" className="bg-background mt-40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Elige el plan perfecto para tu negocio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tenemos un plan que se acomoda a lo que más prefieras
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:shadow-lg flex flex-col ${
                plan.recommended ? "border-primary shadow-lg bg-card" : "border-border hover:border-primary/50"
              }`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1">
                  <Star className="w-4 h-4 mr-1" />
                  Recomendado
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4">{plan.subtitle}</CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-card-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                {/* Features */}
                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 mt-6 hover:scale-105 ${
                    plan.recommended
                      ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
                  }`}
                >
                  <a href="/sign-up" className="hover:cursor-pointer">
                    {plan.cta}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">Todos los planes tienen un segmento gratuito para que pruebes sin compromiso.</p>
        </div>
      </div>
    </section>
  )
}
