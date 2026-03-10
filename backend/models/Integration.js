const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newsapi: { type: String, default: '' },
  openweather: { type: String, default: '' },
  alphavantage: { type: String, default: '' },
  city: { type: String, default: 'Mumbai' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Integration', integrationSchema);