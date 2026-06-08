const express = require('express');
const cors = require('cors');
const loadEnv = require('./utils/loadEnv');

loadEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const analyzeRoutes = require('./routes/analyzeRoutes');
const companyRoutes = require('./routes/companyRoutes');

// Routes
app.use('/analyze', analyzeRoutes);
app.use('/companies', companyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LeetCode AI Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('LeetCode AI Assistant Backend Started');
});

module.exports = app;
