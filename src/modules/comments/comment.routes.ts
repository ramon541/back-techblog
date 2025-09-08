import { Router } from 'express';
import { commentController } from './comment.controller.js';

const router = Router();

router.post('/create', commentController.create);
router.get('/article/:articleId', commentController.getByArticle);
router.get('/:id/replies', commentController.getReplies);
router.get('/:id', commentController.get);
router.get('/', commentController.getAll);
router.put('/:id', commentController.update);
router.delete('/:id', commentController.delete);

export default router;
