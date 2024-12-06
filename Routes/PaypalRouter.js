import express from 'express'
const router = express.Router();
import paypalController from "../controllers/PaypalController.js";
import { authMiddleware } from '../Middleware/AuthMiddleware.js';


// Route tạo order
router.post("/create-order", authMiddleware, paypalController.createOrder);

// Route xác nhận order
router.post("/capture-order/:orderId", authMiddleware, paypalController.captureOrder);

export default router;