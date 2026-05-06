import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler';
import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import tableRoutes from './routes/table.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api', tableRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
