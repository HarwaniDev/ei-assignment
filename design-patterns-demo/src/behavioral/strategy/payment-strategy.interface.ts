export interface IPaymentStrategy {
    processPayment(amount: number, currency: string): Promise<PaymentResult>;
    validatePaymentDetails(details: Record<string, unknown>): boolean;
    getPaymentMethodName(): string;
  }
  
  export interface PaymentResult {
    success: boolean;
    transactionId: string;
    message: string;
    timestamp: Date;
  }