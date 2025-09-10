import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function SubscriptionSection() {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la suscripción')
            }

            setEmail("")
            setIsSubscribed(true)
        } catch (err) {
            console.error("Error:", err)
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setIsLoading(false)
        }
    }

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
                        {!isSubscribed ? (
                            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold my-4 border border-accent/30">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                                ¡Cupos limitados!
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-[#059669]/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-[#059669]/30">
                                <CheckCircle className="w-4 h-4 text-[#059669]" />
                                ¡Pronto nos comunicaremos contigo!
                            </div>
                        )}

                        {!isSubscribed ? (
                            <>
                                {/* Benefits list */}
                                <div className="grid md:grid-cols-3 gap-4 my-6 md:my-10 justify-center">
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
                                <div className="max-w-md mx-auto mb-10">
                                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="flex-1 h-12 text-lg border-2 border-border focus:border-primary"
                                            disabled={isLoading}
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="h-12 px-8 text-lg font-semibold bg-primary hover:bg-secondary transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isLoading || !email}
                                        >
                                            {isLoading ? "Enviando..." : "¡Suscríbete!"}
                                        </Button>
                                    </form>
                                    
                                    {/* Error message */}
                                    {error && (
                                        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                                            {error}
                                        </div>
                                    )}
                                </div>

                                {/* Trust indicators */}
                                <p className="text-sm text-muted-foreground">
                                    🔒 Tu email está seguro. <br />
                                    Sin spam, solo actualizaciones importantes.
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-[#059669]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-[#059669]" />
                                </div>
                                <p className="text-xl text-muted-foreground mb-4">
                                    ¡Gracias por suscribirte! <br /> Te contactaremos pronto con todos los detalles del pre-lanzamiento.
                                </p>
                                {/* <p className="text-sm text-muted-foreground">Revisa tu email para confirmar tu suscripción.</p> */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
