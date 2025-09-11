import { ArrowRight, CalendarCheck, CheckCircle, Clock, CreditCard, Gift, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
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
    <section id="home" className="flex flex-col justify-center bg-background px-4 sm:px-6 lg:px-8 mt-20 max-w-6xl mx-auto text-center">
      <Badge variant="secondary" className="mb-8 animate-fade-in-up px-4 py-2 self-center">
        <Sparkles className="w-4 h-4 mr-2" />
        Pre-lanzamiento exclusivo
      </Badge>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight text-balance">
        Reduce hasta un 30% las ausencias —
        <span className="block text-foreground">y convertí más reservas en ingresos reales.</span>
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed text-pretty">
        TimeLoop automatiza tu agenda, envía recordatorios por WhatsApp y email, y llena los huecos de tu calendario sin esfuerzo
      </p>

      <p className="text-base sm:text-lg text-primary/80 mb-8 font-medium animate-fade-in-up animation-delay-500">
        No te pierdas los beneficios exclusivos de pre-lanzamiento
      </p>

      {/* CTA Button */}
      {!isSubscribed ? (
        <>
          {/* Email subscription form */}
          <div className="max-w-md mx-auto mb-10">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 h-12 text-lg border-2 border-border focus:border-primary w-70"
                disabled={isLoading}
                required
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 text-lg font-semibold bg-primary hover:bg-secondary transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !email}
              >
                {isLoading ? "Enviando..." : "Reservar mi cupo!"}
              </Button>
            </form>

            <Badge variant="outline" className="mt-5 bg-accent text-accent-foreground border-primary/20">
              <CreditCard /> No se requiere tarjeta
            </Badge>
            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
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
      {/* <div className='flex flex-col items-center gap-3'>
        <div className="flex justify-center items-center animate-fade-in-up animation-delay-600">
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"

          >
            <a href="/sign-up" className="hover:cursor-pointer">
              Sumarme al pre-lanzamiento
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
        <Badge variant="outline" className="mb-4 bg-accent text-accent-foreground border-primary/20">
          <CreditCard /> No se requiere tarjeta
        </Badge>
      </div> */}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-4 gap-6 mx-auto animate-fade-in-up animation-delay-800">
        <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-lg font-semibold text-foreground mb-2">Ahorra Tiempo</div>
            <div className="text-sm text-muted-foreground">Los clientes se agendan sin intervención.</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
          <CardContent className="pt-6 text-center">
            <CalendarCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-lg font-semibold text-foreground mb-2">Agenda sin solapamientos</div>
            <div className="text-sm text-muted-foreground">Cada cliente tiene su turno exclusivo, sin dobles reservas ni confusiones.</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-lg font-semibold text-foreground mb-2">Aumenta tus Clientes</div>
            <div className="text-sm text-muted-foreground">Los clientes pueden agendarse en cualquier momento del día, sin tener que esperar.</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
          <CardContent className="pt-6 text-center">
            <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-lg font-semibold text-foreground mb-2">Beneficios Exclusivos</div>
            <div className="text-sm text-muted-foreground">Beneficios exclusivos por registro pre-lanzamiento.</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}