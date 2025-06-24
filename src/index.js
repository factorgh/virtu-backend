// server.js

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import { auth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', auth, applicationRoutes);
app.use('/api/admin', auth, adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtu-pro')
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Only listen locally if not running in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
      });
    } else {
      console.log('⚙️  Server initialized for serverless deployment');
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Export the app for serverless platforms like Vercel
export default app;
