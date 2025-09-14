import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md md:max-w-lg lg:max-w-2xl w-full rounded-2xl shadow-xl p-2 py-6 sm:p-6 md:p-8 lg:p-12 text-center border border-border">
                <div className="mb-6">
                    <CheckCircle className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                        ¡Gracias por registrarte!
                    </h1>
                    <p className="text-base md:text-lg">
                        Guardaremos tu lugar en el prelanzamiento
                    </p>
                </div>

                <div className="mb-8 rounded-lg">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary mb-2">
                        TimeLoop estará disponible muy pronto
                    </h2>
                    <p className=" text-sm md:text-base lg:text-lg">
                        Te notificaremos por email cuando la plataforma esté lista para que
                        puedas comenzar a gestionar tu comercio de manera más eficiente.
                    </p>
                </div>

                <a href="/">
                    <Button className="w-full text-base md:text-lg lg:text-xl py-2 md:py-3 lg:py-4">
                        Volver al inicio
                    </Button>
                </a>
            </div>
        </div>

    )
}
