import { BillingTypes, PaymentMethod } from "./Config";

export enum BusinessCategory {
    Peluqueria = "Peluqueria",
    Barberia = "Barberia",
    Estetica = "Estetica",
    Spa = "Spa",
    Salon = "Salon",
    Masajes = "Masajes",
    Otro = "Otro"
}

export interface ICommerce {
    id: number
    logo: string
    name: string
    email: string
    phone: number
    address: string
    businessCategory: BusinessCategory
    active: boolean
}
