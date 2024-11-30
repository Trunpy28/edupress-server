import express from 'express';
import courseController from '../Controllers/CourseController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';
import { adminAuthMiddleware } from '../Middleware/AdminAuthMiddleware.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/get-courses', courseController.getCourses);
router.get('/detail/url/:urlSlug', courseController.getCourseByUrlSlug);
router.post('/create-many', authMiddleware, courseController.createCourseMany);
router.get('/my-courses', authMiddleware, courseController.getConfirmedCoursesForUser)
router.post('/admin/create', authMiddleware, adminAuthMiddleware, upload.single('courseImage'), courseController.createCourse);
router.get('/admin/course/:courseId', authMiddleware, adminAuthMiddleware, courseController.getCourseById);
router.patch('/admin/:courseId', authMiddleware, adminAuthMiddleware, upload.single('courseImage'), courseController.updateCourse);
router.delete('/admin/:courseId', authMiddleware, adminAuthMiddleware, courseController.deleteCourse);
router.get('/admin/:courseId/registered-users', authMiddleware, adminAuthMiddleware, courseController.getRegisteredUsers);

export default router;
