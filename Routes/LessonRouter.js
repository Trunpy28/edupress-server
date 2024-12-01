import express from 'express';
import LessonController from '../Controllers/LessonController.js';
import { authMiddleware, identifyUserMiddleware } from '../Middleware/AuthMiddleware.js';
import { adminAuthMiddleware } from '../Middleware/AdminAuthMiddleware.js';

const router = express.Router();

router.get('/lessons-by-course/:courseId', identifyUserMiddleware, LessonController.getLessonsByCourse);
router.post('/admin/create', authMiddleware, adminAuthMiddleware, LessonController.createLesson);
router.get('/admin/details/:id', authMiddleware, adminAuthMiddleware, LessonController.getLessonById);
router.put('/admin/update/:id', authMiddleware, adminAuthMiddleware, LessonController.updateLesson);
router.delete('/delete/:id', authMiddleware, adminAuthMiddleware, LessonController.deleteLesson);

export default router;
