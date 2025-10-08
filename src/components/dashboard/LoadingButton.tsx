import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface LoadingButtonProps extends
    React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
    isLoading: boolean;
    loadingText?: string;
    children: React.ReactNode;
    asChild?: boolean;
}

export default function LoadingButton({
    isLoading,
    loadingText = "Cargando...",
    children,
    className = "",
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            disabled={isLoading}
            className={`cursor-pointer hover:scale-105 transition-all duration-300 ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    {loadingText}
                </div>
            ) : (
                children
            )}
        </Button>
    );
}
