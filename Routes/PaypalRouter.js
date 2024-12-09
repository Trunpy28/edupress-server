import express from 'express'
const router = express.Router();
import paypalController from "../controllers/PaypalController.js";
import { authMiddleware } from '../Middleware/AuthMiddleware.js';


// Route tạo payment
router.post("/create-order", authMiddleware, paypalController.createOrder);

// Route xác nhận registration
router.post("/capture-order/:registrationId", authMiddleware, paypalController.captureOrder);

export default router;