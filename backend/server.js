require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { startCronJobs } = require('./cronJobs/businessSimulator');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'OpsPulse API running' }));

// Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`🔌 Client disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  startCronJobs(io);
  server.listen(PORT, () => {
    console.log(`\n🚀 OpsPulse Server running on port ${PORT}`);
    console.log(`📡 Socket.io enabled`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
  });
});
