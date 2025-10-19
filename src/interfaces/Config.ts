export enum BillingTypes {
    FLEXIBLE = "FLEXIBLE",
    FLAT = "FLAT"
}

export enum PaymentMethod {
    MERCADO_PAGO = "MERCADO_PAGO",
    CASH = "CASH"
}

export interface ICommerceConfig {
    id: number,
    commerceId: number,
    cancellationDeadlineMinutes: number,
    billingType: BillingTypes,
    welcomeMessage: string,
    acceptedPaymentMethods: PaymentMethod[]
}

export interface IUserConfig {
    id: number,
    userId: number
}