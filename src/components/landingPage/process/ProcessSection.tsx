import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Settings, BarChart3, UserPlus } from "lucide-react"

const steps = [
  {
    title: "Creas tu cuenta",
    icon: UserPlus,
  },
  {
    title: "Configuras tu negocio",
    icon: Settings,
  },
  {
    title: "Clientes reservan 24/7",
    icon: Clock,
  },
  {
    title: "Gestionás todo desde un panel",
    icon: BarChart3,
  },
]

export default function ProcessSection() {
  return (
    <section id="process" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Proceso Simple
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">Cómo funciona TimeLoop</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            En solo 4 pasos simples, transforma la gestión de tu negocio y libera tu tiempo para lo que realmente
            importa
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 w-full max-w-xs h-full"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                    {/* Step Icon */}
                    <div className="mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
