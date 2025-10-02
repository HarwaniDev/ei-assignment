export interface ILegacyPaymentSystem {
    makePayment(accountNumber: string, amountInCents: number): string;
    checkAccountBalance(accountNumber: string): number;
    getSystemVersion(): string;
  }
  
  export class LegacyPaymentSystem implements ILegacyPaymentSystem {
    private readonly systemVersion: string = '1.2.5';
    private readonly accounts: Map<string, number>;
  
    constructor() {
      this.accounts = new Map([
        ['ACC001', 500000], // $5000.00
        ['ACC002', 1000000], // $10000.00
        ['ACC003', 250000]   // $2500.00
      ]);
    }
  
    public makePayment(accountNumber: string, amountInCents: number): string {
      console.log(`[Legacy System] Processing payment of ${amountInCents} cents from ${accountNumber}`);
      
      if (!this.accounts.has(accountNumber)) {
        return `ERROR: Account ${accountNumber} not found`;
      }
  
      const currentBalance = this.accounts.get(accountNumber)!;
      
      if (currentBalance < amountInCents) {
        return `ERROR: Insufficient funds. Balance: ${currentBalance} cents`;
      }
  
      this.accounts.set(accountNumber, currentBalance - amountInCents);
      
      const transactionId = `LEG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      return `SUCCESS: Transaction ${transactionId} completed`;
    }
  
    public checkAccountBalance(accountNumber: string): number {
      return this.accounts.get(accountNumber) ?? -1;
    }
  
    public getSystemVersion(): string {
      return this.systemVersion;
    }
  }