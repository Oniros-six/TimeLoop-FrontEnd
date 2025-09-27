import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    id: "1",
    question: "¿Qué es TimeLoop y cómo puede ayudar a mi negocio?",
    answer:
      "Es una plataforma de reservas que automatiza la agenda, los recordatorios y los cobros para comercios como peluquerías, barberías, centros de estetica, salones de masaje, etc.",
  },
  {
    id: "2",
    question: "¿Timeloop me da métricas?",
    answer:
      "Sí. Podés ver la cantidad de reservas, cancelaciones, clientes nuevos y estadísticas de uso para detectar oportunidades de mejora.",
  },
  {
    id: "3",
    question: "¿Es seguro dar mi autorización de MercadoPago?",
    answer:
      "Totalmente. La conexión se hace de forma directa con MercadoPago mediante su sistema oficial. TimeLoop nunca accede a tu cuenta de MercadoPago.",
  },
  {
    id: "4",
    question: "¿Cuánto tarda la configuración?",
    answer:
      "Menos de 15 minutos. Si preferís, te asistimos por Zoom en una sesión de 30 minutos.",
  },
  {
    id: "5",
    question: "¿Cómo se agendan mis clientes?",
    answer: (
      <p>
        Al registrarte, recibís un enlace único que podés compartir en redes sociales, a través del cual tus clientes reservan sus turnos. <br />
        Además, te damos un código QR único para tu negocio. Lo ponés en la vidriera, mostrador o tarjetas, y con solo escanearlo tus clientes acceden directo a tu agenda online. <br />
        <b>Es una forma simple y moderna de captar más reservas en el momento.</b>
      </p>
    )
  },
  {
    id: "6",
    question: "¿Cómo funciona el Plan Variable?",
    answer: (
      <p>
        El <b>Plan Variable</b> es muy sencillo <br />
        El costo del servicio es el 1% de lo facturado en el mes. <br />
        Ejemplo: con $70.000 facturados, solo pagás $700.<br />
        Es el plan más justo, porque se adapta a lo que generás.
      </p>
    ),
  },
  {
    id: "7",
    question: "¿Y si el Plan Variable no me sirve?",
    answer: (
      <p>
        No hay problema. Para eso ofrecemos el <b>Plan Fijo</b>, que tiene un
        monto mensual definido independientemente de cuánto factures.
      </p>
    ),
  },
  {
    id: "8",
    question: "¿Tienen un plan gratuito?",
    answer: "Sí, tenemos un plan gratuito que te permite gestionar hasta 40 reservas mensuales, perfecto para comercios que recién comienzan."
  },
  {
    id: "9",
    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
    answer:
      "Sí, podés cancelarla en cualquier momento sin penalizaciones. Tu acceso sigue vigente hasta el final del período de facturación en curso.",
  },
  {
    id: "10",
    question: "¿Puedo cambiar mi suscripción en cualquier momento?",
    answer:
      "Sí, podés cambiarla en cualquier momento sin penalizaciones. Tu plan actual sigue vigente hasta el final del período de facturación.",
  },
  {
    id: "11",
    question: "¿Tengo que conectar MercadoPago obligatoriamente?",
    answer:
      "No. Solo si querés aceptar pagos, configurás MercadoPago cuando quieras.",
  },
];


export default function FAQSection() {
  return (
    <section id="faq" className="bg-background mt-30">
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
