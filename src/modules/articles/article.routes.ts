import { Router } from 'express';
import { articleController } from './article.controller.js';

const router = Router();

router.post('/create', articleController.create);
router.get('/search', articleController.search);
router.get('/:id', articleController.get);
router.get('/', articleController.getAll);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.delete);

export default router;
