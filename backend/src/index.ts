import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { mockAuth } from './middleware/mockAuth.js';
import authRoutes from './routes/auth.js';
import recipientRoutes from './routes/recipients.js';
import uploadRoutes from './routes/uploads.js';
import donorRoutes from './routes/donors.js';
import matchRoutes from './routes/matches.js';
import chatbotRoutes from './routes/chatbot.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mockAuth);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Organ Donation Platform API is running',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
    try {
        await connectDatabase();

        app.listen(env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${env.PORT}`);
            console.log(`   Environment: ${env.NODE_ENV}`);
            console.log(`   Health check: http://localhost:${env.PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
