import React from 'react';
import { ArrowRight, Clock, Gift, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Hero() {
  return (
    <section className="min-h-screen flex justify-center bg-background px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="secondary" className="mb-8 animate-fade-in-up px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Pre-lanzamiento exclusivo
        </Badge>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight text-balance animate-fade-in-up animation-delay-200">
          Transforma la experiencia
          <span className="block text-foreground">de tu negocio</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed text-pretty animate-fade-in-up animation-delay-400">
          Ahorra tiempo, y aumenta tus ventas con TimeLoop
        </p>

        <p className="text-base sm:text-lg text-primary/80 mb-8 font-medium animate-fade-in-up animation-delay-500">
          No te pierdas los beneficios exclusivos de pre-lanzamiento
        </p>

        {/* CTA Button */}
        <div className="flex justify-center items-center animate-fade-in-up animation-delay-600">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Participar del pre-lanzamiento
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-800">
          <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-lg font-semibold text-foreground mb-2">Ahorra Tiempo</div>
              <div className="text-sm text-muted-foreground">Los clientes se agendan sin intervención</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-lg font-semibold text-foreground mb-2">Aumenta tus Clientes</div>
              <div className="text-sm text-muted-foreground">Tiempos optimizados garantiza más clientes</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="pt-6 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-lg font-semibold text-foreground mb-2">Beneficios Exclusivos</div>
              <div className="text-sm text-muted-foreground">Beneficios exclusivos por registro pre-lanzamiento</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}