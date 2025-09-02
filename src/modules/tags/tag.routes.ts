import { Router } from 'express';
import { tagController } from './tag.controller.js';

const router = Router();

router.post('/create', tagController.create);
router.get('/:id', tagController.get);
router.get('/', tagController.getAll);
router.put('/:id', tagController.update);
router.delete('/:id', tagController.delete);

export default router;
