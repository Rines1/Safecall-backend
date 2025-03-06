import { ReportRepository } from '../repositories/report.repository';

type ReportInput = {
  userId: number;
  number: number;
  time: Date;
  type: string;
  reason?: string;
};

export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async createReport(reportData: ReportInput) {
    
     if (reportData.time && !(reportData.time instanceof Date)) {
      reportData.time = new Date(reportData.time);
    }
    return this.reportRepository.create(reportData);
  }

  async getReports(userId: number) {
    return this.reportRepository.findByUserId(userId);
  }

  async getReportById(reportId: number, userId: number) {
    const report = await this.reportRepository.findById(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    if (report.userId !== userId) {
      throw new Error('Unauthorized to access this report');
    }
    
    return report;
  }

  async updateReport(reportId: number, userId: number, reportData: Partial<ReportInput>) {
    const report = await this.reportRepository.findById(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    if (report.userId !== userId) {
      throw new Error('Unauthorized to update this report');
    }
    
    return this.reportRepository.update(reportId, reportData);
  }

  async deleteReport(reportId: number, userId: number) {
    const report = await this.reportRepository.findById(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    if (report.userId !== userId) {
      throw new Error('Unauthorized to delete this report');
    }
    
    return this.reportRepository.delete(reportId);
  }
}