import { useEffect, useState } from "react"
import { userAtom } from '@/stores/auth';
import { useAtom } from 'jotai';
import { LoginForm } from "@/components/login/LoginForm"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function Login() {
    const backendURL = import.meta.env.PUBLIC_ENV === "DEV" ? "http://localhost:3000" : import.meta.env.PUBLIC_BACKEND_URL

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [, setUser] = useAtom(userAtom);
    const { user } = useAuthCheck();

    useEffect(() => {
      if (user) {
        window.location.href = '/admin'; // redirige si ya está logueado
      }
    }, [user]);
  

    const handleLogin = async (data: { email: string; password: string }) => {
        setIsLoading(true)
        setErrors({})

        try {
            // Simulación de llamada al backend
            const response = await fetch(backendURL + "/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()

                if (response.status === 401) {
                    setErrors({ general: "Email o contraseña incorrectos" })
                } else {
                    setErrors({ general: errorData.message || "Error al iniciar sesión. Intenta nuevamente." })
                }
                return
            }

            const result = await response.json()

            setUser(result.user);
            window.location.href = '/admin'

        } catch (error) {
            console.error("Error de conexión:", error)
            setErrors({ general: "Error de conexión. Verifica tu internet e intenta nuevamente." })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md place-self-center">
            <CardContent className="px-2 py-6 sm:p-6">
                <LoginForm onSubmit={handleLogin} errors={errors} isLoading={isLoading} />
                {errors.general && <p className="text-sm text-red-500 text-center mt-4">{errors.general}</p>}

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">¿Aún no tienes cuenta?</p>
                    <a href="/registro?plan=flexible">
                        <Button variant="outline" className="w-full bg-transparent cursor-pointer hover:border-border">
                            Crear cuenta
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    )
}