export enum ReportFormat {
    PDF = 'PDF',
    HTML = 'HTML',
    JSON = 'JSON',
    CSV = 'CSV'
  }
  
  export enum ReportSection {
    HEADER = 'HEADER',
    SUMMARY = 'SUMMARY',
    DETAILS = 'DETAILS',
    CHARTS = 'CHARTS',
    FOOTER = 'FOOTER'
  }
  
  export interface IReportMetadata {
    title: string;
    author: string;
    createdAt: Date;
    department?: string;
    confidential: boolean;
  }
  
  export interface IReportContent {
    sections: Map<ReportSection, string>;
    data: Record<string, unknown>;
    charts?: string[];
  }
  
  export interface IReport {
    metadata: IReportMetadata;
    content: IReportContent;
    format: ReportFormat;
    pageCount: number;
    generate(): Promise<string>;
    validate(): boolean;
  }