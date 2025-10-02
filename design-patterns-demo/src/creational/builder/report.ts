import { IReport, IReportMetadata, IReportContent, ReportFormat } from './report.types';
import { Logger } from '../../core/logger/logger';
import { ValidationError } from '../../core/error-handler/custom-errors';

export class Report implements IReport {
  public metadata: IReportMetadata;
  public content: IReportContent;
  public format: ReportFormat;
  public pageCount: number;
  private readonly logger: Logger;

  constructor(
    metadata: IReportMetadata,
    content: IReportContent,
    format: ReportFormat
  ) {
    this.metadata = metadata;
    this.content = content;
    this.format = format;
    this.pageCount = this.calculatePageCount();
    this.logger = Logger.getInstance();
  }

  public async generate(): Promise<string> {
    if (!this.validate()) {
      throw new ValidationError('Report validation failed');
    }

    this.logger.info(
      `Generating ${this.format} report: ${this.metadata.title}`,
      'Report'
    );

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reportContent = this.formatReport();

    this.logger.info(
      `Report generated successfully (${this.pageCount} pages)`,
      'Report',
      { format: this.format, title: this.metadata.title }
    );

    return reportContent;
  }

  public validate(): boolean {
    if (!this.metadata.title || this.metadata.title.trim().length === 0) {
      this.logger.error('Report title is required', 'Report');
      return false;
    }

    if (this.content.sections.size === 0) {
      this.logger.error('Report must have at least one section', 'Report');
      return false;
    }

    return true;
  }

  private calculatePageCount(): number {
    let totalContent = 0;
    this.content.sections.forEach(content => {
      totalContent += content.length;
    });

    // Estimate: 2000 characters per page
    return Math.max(1, Math.ceil(totalContent / 2000));
  }

  private formatReport(): string {
    switch (this.format) {
      case ReportFormat.HTML:
        return this.generateHtmlReport();
      case ReportFormat.JSON:
        return this.generateJsonReport();
      case ReportFormat.PDF:
        return this.generatePdfReport();
      case ReportFormat.CSV:
        return this.generateCsvReport();
      default:
        return this.generatePlainTextReport();
    }
  }

  private generateHtmlReport(): string {
    let html = `<!DOCTYPE html><html><head><title>${this.metadata.title}</title></head><body>`;
    html += `<h1>${this.metadata.title}</h1>`;
    html += `<p>Author: ${this.metadata.author}</p>`;
    html += `<p>Date: ${this.metadata.createdAt.toLocaleDateString()}</p>`;
    html += `<hr>`;

    this.content.sections.forEach((content, section) => {
      html += `<section><h2>${section}</h2><p>${content}</p></section>`;
    });

    html += `</body></html>`;
    return html;
  }

  private generateJsonReport(): string {
    return JSON.stringify({
      metadata: this.metadata,
      content: {
        sections: Array.from(this.content.sections.entries()).map(([key, value]) => ({
          section: key,
          content: value
        })),
        data: this.content.data
      },
      format: this.format,
      pageCount: this.pageCount
    }, null, 2);
  }

  private generatePdfReport(): string {
    return `[PDF Report - ${this.metadata.title}]\nPages: ${this.pageCount}\nGenerated: ${this.metadata.createdAt.toISOString()}`;
  }

  private generateCsvReport(): string {
    let csv = `Title,Author,Date,Section,Content\n`;
    this.content.sections.forEach((content, section) => {
      csv += `"${this.metadata.title}","${this.metadata.author}","${this.metadata.createdAt.toISOString()}","${section}","${content.replace(/"/g, '""')}"\n`;
    });
    return csv;
  }

  private generatePlainTextReport(): string {
    let text = `${this.metadata.title}\n${'='.repeat(60)}\n`;
    text += `Author: ${this.metadata.author}\n`;
    text += `Date: ${this.metadata.createdAt.toLocaleDateString()}\n\n`;

    this.content.sections.forEach((content, section) => {
      text += `\n${section}\n${'-'.repeat(40)}\n${content}\n`;
    });

    return text;
  }
}