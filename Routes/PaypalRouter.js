import express from 'express'
const router = express.Router();
import PaypalController from "../controllers/PaypalController.js";
import { authMiddleware } from '../Middleware/AuthMiddleware.js';


// Route tạo payment
router.post("/create-order", authMiddleware, PaypalController.createOrder);

// Route xác nhận registration
router.post("/capture-order/:registrationId", authMiddleware, PaypalController.captureOrder);

export default router;