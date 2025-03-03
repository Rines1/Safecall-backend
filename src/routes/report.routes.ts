import { Router } from 'express';
import { RequestHandler } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
} from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();



router.post('/', createReport as unknown as RequestHandler);
router.get('/', getReports as unknown as RequestHandler);
router.get('/:id', getReportById as unknown as RequestHandler);
router.put('/:id', updateReport as unknown as RequestHandler);
router.delete('/:id', deleteReport as unknown as RequestHandler);

export default router;