import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(cors());
app.use(express.json());

// Routes will be added per unit
// app.use('/api', customerRoutes);
// app.use('/api/admin', adminRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
