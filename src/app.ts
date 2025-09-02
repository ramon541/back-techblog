import express from 'express';
import { requestLoggingMiddleware } from './middlewares/requestLogging.middleware.js';
import router from './routes/index.js';

const app = express();

// Request logging middleware
app.use(requestLoggingMiddleware);

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

export default app;
