import { ReportService } from '../../services/report.service';
import { ReportRepository } from '../../repositories/report.repository';

// Mock the ReportRepository
jest.mock('../../repositories/report.repository');

describe('ReportService', () => {
  let reportService: ReportService;
  let reportRepository: jest.Mocked<ReportRepository>;

  beforeEach(() => {
    reportRepository = new ReportRepository() as jest.Mocked<ReportRepository>;
    reportService = new ReportService(reportRepository);
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('should create a report', async () => {
      // Arrange
      const reportData = {
        userId: 1,
        number: 123,
        time: new Date(),
        type: 'incident',
        reason: 'test reason'
      };
      
      const createdReport = { id: 1, ...reportData };
      
      reportRepository.create.mockResolvedValue(createdReport);
      
      // Act
      const result = await reportService.createReport(reportData);
      
      // Assert
      expect(reportRepository.create).toHaveBeenCalledWith(reportData);
      expect(result).toEqual(createdReport);
    });
  });

  describe('getReports', () => {
    it('should return reports for a user', async () => {
      // Arrange
      const userId = 1;
      const reports = [
        { id: 1, userId, number: 123, time: new Date(), type: 'incident' },
        { id: 2, userId, number: 456, time: new Date(), type: 'request' }
      ];
      
      reportRepository.findByUserId.mockResolvedValue(reports);
      
      // Act
      const result = await reportService.getReports(userId);
      
      // Assert
      expect(reportRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(reports);
    });
  });

  describe('getReportById', () => {
    it('should return a report by id if user is authorized', async () => {
      // Arrange
      const userId = 1;
      const reportId = 1;
      const report = { id: reportId, userId, number: 123, time: new Date(), type: 'incident' };
      
      reportRepository.findById.mockResolvedValue(report);
      
      // Act
      const result = await reportService.getReportById(reportId, userId);
      
      // Assert
      expect(reportRepository.findById).toHaveBeenCalledWith(reportId);
      expect(result).toEqual(report);
    });

    it('should throw error if report not found', async () => {
      // Arrange
      reportRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(reportService.getReportById(1, 1))
        .rejects.toThrow('Report not found');
    });

    it('should throw error if user is not authorized', async () => {
      // Arrange
      const userId = 1;
      const otherUserId = 2;
      const reportId = 1;
      const report = { id: reportId, userId: otherUserId, number: 123, time: new Date(), type: 'incident' };
      
      reportRepository.findById.mockResolvedValue(report);
      
      // Act & Assert
      await expect(reportService.getReportById(reportId, userId))
        .rejects.toThrow('Unauthorized to access this report');
    });
  });

  // Similar tests for updateReport and deleteReport methods
});