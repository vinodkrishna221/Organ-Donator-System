import { Router } from 'express';
import * as chatbotController from '../controllers/chatbotController.js';

const router = Router();

// Public endpoint - no auth required for chatbot
// In production, you might want rate limiting

/**
 * POST /api/chatbot/query
 * Main query endpoint for the chatbot
 */
router.post('/query', chatbotController.queryChatbot);

/**
 * GET /api/chatbot/history/:sessionId
 * Get conversation history for a session
 */
router.get('/history/:sessionId', chatbotController.getChatHistory);

/**
 * DELETE /api/chatbot/history/:sessionId
 * Clear conversation history
 */
router.delete('/history/:sessionId', chatbotController.clearChatHistory);

export default router;
