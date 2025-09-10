import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, CheckCircle } from "lucide-react"

export default function SubscriptionSection() {
    return (
        <section className="bg-gradient-to-br from-background via-muted/30 to-background mt-20">
            <div className="max-w-4xl mx-auto text-center">
                <Card className="border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-sm">
                    <CardContent className="px-2 md:p-12">
                        {/* Icon and urgency indicator */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Clock className="w-8 h-8 text-primary" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-accent-foreground" />
                                </div>
                            </div>
                        </div>

                        {/* Main headline */}
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                            ¡Sé de los primeros en experimentar TimeLoop!
                        </h2>

                        <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-accent/30">
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                            ¡Cupos limitados!
                        </div>

                        {/* Subtext */}
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                            Suscríbete ahora para acceso exclusivo al pre-lanzamiento y obtén beneficios únicos que no encontrarás
                            después.
                        </p>

                        {/* Benefits list */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8 justify-center">
                            <div className="flex items-center justify-start md:justify-center gap-2 text-card-foreground">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                <span className="font-medium">Acceso anticipado</span>
                            </div>
                            <div className="flex items-center justify-start md:justify-center gap-2 text-card-foreground">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                <span className="font-medium">Precio especial</span>
                            </div>
                            <div className="flex items-center justify-start md:justify-center gap-2 text-card-foreground">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                <span className="font-medium">Soporte prioritario</span>
                            </div>
                        </div>

                        {/* Email subscription form */}
                        <div className="max-w-md mx-auto mb-6">
                            <div className="flex flex-col md:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="flex-1 h-12 text-lg border-2 border-border focus:border-primary"
                                />
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-lg font-semibold bg-primary hover:bg-secondary transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    ¡Suscríbete!
                                </Button>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <p className="text-sm text-muted-foreground">
                            🔒 Tu email está seguro. <br />
                            Sin spam, solo actualizaciones importantes.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
