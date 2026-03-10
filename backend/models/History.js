const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  revenue: { type: Number, required: true },
  orders: { type: Number, required: true },
  inventoryHealth: { type: Number, required: true },
  openTickets: { type: Number, required: true },
  stressScore: { type: Number, required: true },
  period: { type: String, required: true }
});

module.exports = mongoose.model('History', historySchema);
