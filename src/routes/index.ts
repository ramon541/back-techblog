import { Router } from 'express';
import userRoutes from '../modules/users/user.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import tagRoutes from '../modules/tags/tag.routes.js';
import articleRoutes from '../modules/articles/article.routes.js';
import commentRoutes from '../modules/comments/comment.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/tags', tagRoutes);
router.use('/articles', articleRoutes);
router.use('/comments', commentRoutes);

export default router;
