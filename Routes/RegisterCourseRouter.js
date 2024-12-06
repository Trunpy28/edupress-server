import express from 'express';
import RegisterCourseController from '../Controllers/RegisterCourseController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';
import { adminAuthMiddleware } from '../Middleware/AdminAuthMiddleware.js';
const router = express.Router();

router.get('/admin/registrations', authMiddleware, adminAuthMiddleware, RegisterCourseController.getAllRegistrations);
router.patch('/admin/registrations/:id', authMiddleware, adminAuthMiddleware, RegisterCourseController.updateRegistrationStatus);
router.post('/register', authMiddleware, RegisterCourseController.createRegistration);
router.get('/get-registration/:courseId', authMiddleware, RegisterCourseController.getRegisteredCourse);

export default router;
