import express from 'express';
import { getAllRegistrations, approveRegistration, createRegistration, getRegisteredCourse } from '../Controllers/RegisterCourseController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';
const router = express.Router();

router.get('/registrations', getAllRegistrations);
router.put('/registrations/:id', authMiddleware, approveRegistration);
router.post('/register', authMiddleware, createRegistration);
router.get('/get-registration/:courseId', authMiddleware, getRegisteredCourse);

export default router;
