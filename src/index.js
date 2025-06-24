import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

// Routes
import { auth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';
import morgan from 'morgan';

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

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtu-pro')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Server will be started by Vercel automatically
    console.log('Server initialized');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
