import { Router } from 'express';
import { userController } from './user.controller.js';

const router = Router();

router.post('/create', userController.create);
router.get('/:id', userController.get);
router.get('/', userController.getAll);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
