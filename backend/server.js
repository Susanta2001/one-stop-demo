const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
// Add this CORS middleware BEFORE your routes:
app.use(cors({
    origin: 'http://localhost:3000', // your React app URL
    credentials: true, // allow cookies/auth headers
  }));
  
app.use(express.json()); // To parse JSON bodies

// Routes (you'll add these soon)

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));



// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
