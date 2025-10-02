export interface IModernPaymentGateway {
    processPayment(accountId: string, amount: number, currency: string): Promise<PaymentResponse>;
    getAccountInfo(accountId: string): Promise<AccountInfo>;
  }
  
  export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    timestamp: Date;
    message: string;
  }
  
  export interface AccountInfo {
    accountId: string;
    balance: number;
    currency: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }