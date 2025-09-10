import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Settings, BarChart3, UserPlus } from "lucide-react"

const steps = [
    {
        title: "Crea tu cuenta",
        description: "En 2 minutos creas la cuenta de tu negocio. Tan sencillo como suena.",
        icon: UserPlus,
    },
    {
        title: "Configura tu negocio",
        description: "Define tus servicios, horarios y preferencias en minutos. TimeLoop se adapta a tu forma de trabajar.",
        icon: Settings,
    },
    {
        title: "Automatiza las reservas",
        description:
            "Tus clientes pueden reservar 24/7 a través de tu enlace personalizado. Sin llamadas, sin complicaciones.",
        icon: Clock,
    },
    {
        title: "Gestiona todo desde un lugar",
        description: "Ve todas tus citas, clientes y métricas en un dashboard intuitivo. Control total de tu agenda.",
        icon: BarChart3,
    }
]

export default function ProcessSection() {
    return (
        <section id="process" className="bg-background mt-40">
            <div className="container mx-auto">
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

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <Card
                                    key={index}
                                    className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 py-0 min-h-60 md:min-h-40 justify-center"
                                >
                                    <CardContent className="p-2 sm:p-4 md:p-8">
                                        <div className="flex items-start gap-6">
                                            {/* Step Icon */}
                                            <div className="flex-shrink-0 self-center">
                                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                                                    {step.title}
                                                </h3>
                                                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                                            </div>
                                        </div>
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
