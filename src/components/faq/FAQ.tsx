import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    id: "1",
    question: "¿Qué es TimeLoop y cómo puede ayudar a mi negocio?",
    answer:
      "TimeLoop es una herramienta integral de gestión de turnos, personal y métricas, que te ahorra horas de trabajo al mes. Además, con sus reportes y estadísticas, sabrás exactamente cómo mejorar tu negocio.",
  },
  {
    id: "2",
    question: "¿Cuánto tiempo toma configurar mi negocio en TimeLoop?",
    answer:
      "La configuración toma apenas unos minutos: creás tu cuenta, definís los servicios que ofrecerás, completás algunos detalles más ¡y listo! Además, podemos guiarte en el proceso si lo necesitás.",
  },
  {
    id: "3",
    question: "¿Cómo se agendan mis clientes?",
    answer:
      "Al registrarte, recibís un enlace único que podés compartir en redes sociales, mediante el cual tus clientes podrán reservar sus turnos. También se te proporciona un código QR exclusivo para tu negocio.",
  },
  {
    id: "4",
    question: "¿Cómo funciona el Plan Variable?",
    answer: (
      <p>
        El <b>Plan Variable</b> es muy sencillo: si en el mes <b>no</b> facturás más de
        $50.000, entonces <b>no</b> te cobramos el servicio. <br />
        Si facturás más, el costo del servicio es el 1% de ese monto. <br />
        Ejemplo: con $70.000 facturados, solo pagás $700 <br />
        Es el plan más justo, porque se adapta a lo que generás.
      </p>
    ),
  },
  {
    id: "5",
    question: "¿Y si el Plan Variable no me sirve?",
    answer: (
      <p>
        No hay problema. Para eso ofrecemos el <b>Plan Fijo</b>, que tiene un
        monto mensual definido independientemente de cuánto factures. <br />
        Además, este plan incluye un beneficio: el servicio es gratuito hasta
        las primeras 40 reservas del mes. <br />
        Es decir, si recibís hasta 40 reservas, no pagás nada; si superás ese
        número, se aplicará el costo del plan.
      </p>
    ),
  },
  {
    id: "6",
    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
    answer:
      "Sí, podés cancelar tu suscripción en cualquier momento sin penalizaciones. Tu acceso continuará vigente hasta el final de tu período de facturación actual.",
  },
];


export default function FAQSection() {
  return (
    <section id="faq" className="bg-background mt-40">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Preguntas Frecuentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Encuentra respuestas a las preguntas más comunes sobre TimeLoop y cómo puede transformar tu negocio
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-1">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-0 border-b border-border/20 last:border-b-0 group"
              >
                <AccordionTrigger className="py-6 px-0 text-left hover:no-underline [&[data-state=open]>svg]:rotate-45 transition-all duration-300 ease-out">
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200 text-left">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-12 pr-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="text-muted-foreground leading-relaxed text-[15px]">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
