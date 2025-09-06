import { Router } from 'express';
import { commentController } from './comment.controller.js';

const router = Router();

router.post('/create', commentController.create);
router.get('/:id', commentController.get);
router.get('/', commentController.getAll);
router.get('/:id/replies', commentController.getReplies);
router.put('/:id', commentController.update);
router.delete('/:id', commentController.delete);

export default router;
