import type { IUser } from "@/interfaces/User";
import ServiceCard from "./ServiceCard";
import type { IService } from "@/interfaces/Service";

interface ServicesGridProps {
  services: IService[];
  currentUser: IUser | null;
  onServiceClick: (service: IService) => void;
  onDelete: (service: IService) => void;
  onUpdate: (service: IService) => void;
}

export function ServicesGrid({
  services,
  currentUser,
  onServiceClick,
  onDelete,
  onUpdate,
}: ServicesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          currentUser={currentUser}
          handleServiceClick={onServiceClick}
          handleDelete={onDelete}
          handleUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
