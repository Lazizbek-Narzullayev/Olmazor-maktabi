import express from 'express';
import { getTalents, createTalent, updateTalent, deleteTalent } from './talentController.js';

const router = express.Router();

router.get('/', getTalents);            // Hammaga ochiq
router.post('/', createTalent);         // Admin
router.patch('/:id', updateTalent);     // Admin
router.delete('/:id', deleteTalent);    // Admin

export default router;
