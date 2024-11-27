import express from 'express';
import userController from '../Controllers/UserController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';
import multer from 'multer';
import { adminAuthMiddleware } from '../Middleware/AdminAuthMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/refresh-token', userController.refreshUserToken);
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/updateAvatar', authMiddleware,upload.single('avatarFile') , userController.updateAvatar);
router.put('/update', authMiddleware, userController.updateUserProfile);
router.get('/admin/get-all', authMiddleware, adminAuthMiddleware, userController.getUsers);
router.post('/admin/create-user', authMiddleware, adminAuthMiddleware, userController.createUser);
router.put('/admin/edit-profile', authMiddleware, adminAuthMiddleware, userController.editUserProfile);
router.delete('/admin/:userId', authMiddleware, adminAuthMiddleware, userController.deleteUser);
router.get('/admin/search', authMiddleware, adminAuthMiddleware, userController.searchUsers);

export default router;