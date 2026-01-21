import { Request, Response, NextFunction } from 'express';
import { ragPipeline } from '../services/chatbot/ragPipeline.js';
import { v4 as uuidv4 } from 'uuid';

export async function queryChatbot(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { query, sessionId } = req.body;

        if (!query || typeof query !== 'string') {
            res.status(400).json({
                success: false,
                error: { message: 'Query is required and must be a string' },
            });
            return;
        }

        // Generate session ID if not provided
        const currentSessionId = sessionId || uuidv4();

        // Add user message to history
        ragPipeline.addToHistory(currentSessionId, {
            role: 'user',
            content: query,
            timestamp: new Date(),
        });

        // Process the query
        const response = await ragPipeline.query(query);

        // Add assistant response to history
        ragPipeline.addToHistory(currentSessionId, {
            role: 'assistant',
            content: response.answer,
            timestamp: new Date(),
        });

        res.json({
            success: true,
            data: {
                sessionId: currentSessionId,
                ...response,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getChatHistory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            res.status(400).json({
                success: false,
                error: { message: 'Session ID is required' },
            });
            return;
        }

        const history = ragPipeline.getHistory(sessionId);

        res.json({
            success: true,
            data: {
                sessionId,
                history,
                messageCount: history.length,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function clearChatHistory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            res.status(400).json({
                success: false,
                error: { message: 'Session ID is required' },
            });
            return;
        }

        ragPipeline.clearHistory(sessionId);

        res.json({
            success: true,
            message: 'Chat history cleared',
        });
    } catch (error) {
        next(error);
    }
}
