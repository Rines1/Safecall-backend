import { Router } from 'express';
import { 
  createReport, 
  getReports, 
  getReportById, 
  updateReport, 
  deleteReport 
} from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateReport } from '../middleware/validation.middleware';

const router = Router();

// All report routes require authentication
router.use(authenticate);

router.post('/', validateReport, createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', validateReport, updateReport);
router.delete('/:id', deleteReport);

export default router;