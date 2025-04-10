import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, testConnection } from './db';
import articleRoutes from './routes/articles';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/articles', articleRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

console.log('Testing database connection...');
testConnection()
  .then(connected => {
    if (!connected) {
      console.error('Database connection test failed. Please check your MySQL settings:');
      console.error(`- Host: ${process.env.DB_HOST}`);
      console.error(`- Port: ${process.env.DB_PORT}`);
      console.error(`- User: ${process.env.DB_USER}`);
      console.error(`- Database: ${process.env.DB_NAME}`);
      console.error('Make sure MySQL is running and the credentials are correct.');
      process.exit(1);
    }
    
    console.log('Database connection successful. Initializing database...');
    return initializeDatabase();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Health check endpoint: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    console.error('Please ensure MySQL is running and the connection details are correct.');
    process.exit(1);
  }); 