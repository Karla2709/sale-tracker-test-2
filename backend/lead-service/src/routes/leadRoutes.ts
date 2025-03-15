import { Router } from 'express';
import { 
  getAllLeads, 
  getLeadById, 
  createLead, 
  updateLead, 
  deleteLead,
  filterLeads
} from '../controllers/leadController';

const router = Router();

// Get all leads
router.get('/', getAllLeads);

// Filter leads
router.post('/filter', filterLeads);

// Get lead by ID
router.get('/:id', getLeadById);

// Create new lead
router.post('/', createLead);

// Update lead
router.put('/:id', updateLead);

// Delete lead
router.delete('/:id', deleteLead);

export default router; 