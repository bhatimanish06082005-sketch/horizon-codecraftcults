require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { startAutoSave } = require('./cronJobs/businessSimulator');

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://opspulse-frontend-app.onrender.com',
  'https://opspulse-delta.vercel.app',
];

const io = socketio(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'OpsPulse API running', version: '2.0' }));
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startAutoSave();
  });
});