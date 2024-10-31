import express from 'express';
import { registerUser, loginUser, loginUserName, refreshUserToken, logoutUser, getUserProfile, updateAvatar, updateUserProfile } from '../Controllers/UserController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/register', registerUser);
router.post('/login-user-name', loginUserName);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshUserToken);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/updateAvatar', authMiddleware,upload.single('avatarFile') , updateAvatar);
router.put('/update', authMiddleware, updateUserProfile);

export default router;