import { Report } from './report';
import { IReportMetadata, IReportContent, ReportFormat, ReportSection } from './report.types';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';

export class ReportBuilder {
  private metadata: Partial<IReportMetadata> = {};
  private sections: Map<ReportSection, string> = new Map();
  private data: Record<string, unknown> = {};
  private charts: string[] = [];
  private format: ReportFormat = ReportFormat.HTML;
  private readonly logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public setTitle(title: string): ReportBuilder {
    const validation = Validator.validateNotEmpty(title, 'Report title');
    Validator.throwIfInvalid(validation, 'ReportBuilder.setTitle');
    
    this.metadata.title = title;
    this.logger.debug(`Report title set: ${title}`, 'ReportBuilder');
    return this;
  }

  public setAuthor(author: string): ReportBuilder {
    const validation = Validator.validateNotEmpty(author, 'Author name');
    Validator.throwIfInvalid(validation, 'ReportBuilder.setAuthor');
    
    this.metadata.author = author;
    this.logger.debug(`Report author set: ${author}`, 'ReportBuilder');
    return this;
  }

  public setDepartment(department: string): ReportBuilder {
    this.metadata.department = department;
    this.logger.debug(`Report department set: ${department}`, 'ReportBuilder');
    return this;
  }

  public setConfidential(confidential: boolean): ReportBuilder {
    this.metadata.confidential = confidential;
    this.logger.debug(`Report confidentiality set: ${confidential}`, 'ReportBuilder');
    return this;
  }

  public addSection(section: ReportSection, content: string): ReportBuilder {
    const validation = Validator.validateNotEmpty(content, `Section ${section} content`);
    Validator.throwIfInvalid(validation, 'ReportBuilder.addSection');
    
    this.sections.set(section, content);
    this.logger.debug(`Section added: ${section}`, 'ReportBuilder');
    return this;
  }

  public addData(key: string, value: unknown): ReportBuilder {
    this.data[key] = value;
    this.logger.debug(`Data added: ${key}`, 'ReportBuilder');
    return this;
  }

  public addChart(chartDescription: string): ReportBuilder {
    this.charts.push(chartDescription);
    this.logger.debug(`Chart added: ${chartDescription}`, 'ReportBuilder');
    return this;
  }

  public setFormat(format: ReportFormat): ReportBuilder {
    this.format = format;
    this.logger.debug(`Report format set: ${format}`, 'ReportBuilder');
    return this;
  }

  public build(): Report {
    this.logger.info('Building report', 'ReportBuilder', {
      title: this.metadata.title,
      format: this.format,
      sectionCount: this.sections.size
    });

    // Validate required fields
    if (!this.metadata.title || !this.metadata.author) {
      throw new Error('Title and author are required to build a report');
    }

    const completeMetadata: IReportMetadata = {
      title: this.metadata.title,
      author: this.metadata.author,
      createdAt: new Date(),
      department: this.metadata.department,
      confidential: this.metadata.confidential ?? false
    };

    const content: IReportContent = {
      sections: new Map(this.sections),
      data: { ...this.data },
      charts: [...this.charts]
    };

    return new Report(completeMetadata, content, this.format);
  }

  public reset(): ReportBuilder {
    this.metadata = {};
    this.sections.clear();
    this.data = {};
    this.charts = [];
    this.format = ReportFormat.HTML;
    this.logger.debug('Report builder reset', 'ReportBuilder');
    return this;
  }
}