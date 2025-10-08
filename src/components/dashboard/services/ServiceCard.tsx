import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IService } from "@/interfaces/Service";
import { DollarSign, Clock } from "lucide-react";
import ServiceOptions from "./ServiceOptions";
import type { IUser } from "@/interfaces/User";

interface PropsInterface {
    service: IService,
    handleServiceClick: (service: IService) => void;
    currentUser: IUser | null;
    handleDelete: (service: IService) => void
    handleUpdate: (service: IService) => void
}

export default function ServiceCard({
    service,
    handleServiceClick,
    currentUser,
    handleDelete,
    handleUpdate,
}: PropsInterface) {

    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] relative"
            onClick={() => handleServiceClick(service)}
        >
            {
                currentUser?.id === service.userId ?
                    <ServiceOptions
                        service={service}
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                    /> :
                    null
            }
            <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {service.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{
                        service.price.toLocaleString("es-UY", {
                            style: "currency",
                            currency: "UYU",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })
                    }</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.durationMinutes} minutos</span>
                </div>
            </CardContent>
        </Card>
    )
}