import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { ReportRepository } from '../repositories/report.repository';

const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);

export const createReport = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - we'll add userId to the request in the auth middleware
    const userId = req.userId;
    const report = await reportService.createReport({ ...req.body, userId });
    return res.status(201).json(report);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const reports = await reportService.getReports(userId);
    return res.status(200).json(reports);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const reportId = parseInt(req.params.id);
    const report = await reportService.getReportById(reportId, userId);
    return res.status(200).json(report);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const reportId = parseInt(req.params.id);
    const report = await reportService.updateReport(reportId, userId, req.body);
    return res.status(200).json(report);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const reportId = parseInt(req.params.id);
    await reportService.deleteReport(reportId, userId);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};