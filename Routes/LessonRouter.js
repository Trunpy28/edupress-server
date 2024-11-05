import express from 'express';
import { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson, getLessonsByCourse } from '../Controllers/LessonController.js';
import { authMiddleware, identifyUserMiddleware } from '../Middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createLesson);
router.get('/', getAllLessons);
router.get('/:id', getLessonById);
router.put('/:id', authMiddleware, updateLesson);
router.delete('/:id', authMiddleware, deleteLesson);
router.get('/lessons-by-course/:courseId', identifyUserMiddleware, getLessonsByCourse);

export default router;
