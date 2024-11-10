import express from 'express';
import { createReview, updateReview, getReviewsByCourse, deleteReview } from '../Controllers/CourseReviewController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createReview);
router.put('/update', authMiddleware, updateReview);
router.get('/get-by-course/:courseId', getReviewsByCourse);
router.delete('/delete/:id', authMiddleware, deleteReview);

export default router;
